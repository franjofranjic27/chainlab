// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title Escrow — ein Treuhand-Contract fuer ETH
/// @notice Der Buyer hinterlegt ETH. Bestaetigt er die Lieferung, geht das Geld
///         an den Seller. Der Arbiter kann im Streitfall an den Buyer erstatten.
/// @dev Demonstriert `payable` / `msg.value`, das Versenden von ETH per `.call`,
///      eine `enum`-State-Machine und das Checks-Effects-Interactions-Muster
///      (Zustand VOR dem externen Transfer aendern) als Reentrancy-Schutz.
contract Escrow {
    /// @dev Lebenszyklus der Treuhand. Jede Funktion ist nur in einem
    ///      bestimmten Zustand erlaubt. `Complete` und `Refunded` sind
    ///      terminal — aus ihnen fuehrt kein Uebergang zurueck.
    enum State {
        AwaitingPayment,
        AwaitingDelivery,
        Complete,
        Refunded
    }

    /// @notice Hinterlegt das ETH und bestaetigt die Lieferung (= der Deployer).
    address public immutable buyer;

    /// @notice Empfaengt das ETH bei bestaetigter Lieferung.
    /// @dev `address payable` => an diese Adresse darf ETH gesendet werden.
    address payable public immutable seller;

    /// @notice Neutrale Partei, die im Streitfall erstatten darf.
    address public immutable arbiter;

    /// @notice Aktueller Zustand der Treuhand.
    State public state;

    /// @notice Vom Buyer hinterlegter Betrag in Wei.
    /// @dev Bewusst eigene Buchhaltung statt `address(this).balance`: ein
    ///      Dritter koennte dem Contract per `selfdestruct` ungewollt ETH
    ///      aufzwingen. Ausgezahlt wird exakt das, was eingezahlt wurde.
    uint256 public depositAmount;

    event Deposited(address indexed buyer, uint256 amount);
    event Released(address indexed seller, uint256 amount);
    event Refunded(address indexed buyer, uint256 amount);

    error NotBuyer();
    error NotArbiter();
    error InvalidState();
    error InvalidParticipant();
    error ZeroDeposit();
    error TransferFailed();

    modifier onlyBuyer() {
        if (msg.sender != buyer) {
            revert NotBuyer();
        }
        _;
    }

    modifier onlyArbiter() {
        if (msg.sender != arbiter) {
            revert NotArbiter();
        }
        _;
    }

    /// @dev Stellt sicher, dass eine Funktion nur im erwarteten Zustand laeuft.
    ///      Ist zugleich der Reentrancy-Schutz: da `confirmDelivery`/`refund`
    ///      den State VOR dem `.call` weiterschalten, scheitert ein reentranter
    ///      Rueckruf hier mit `InvalidState`.
    modifier inState(State expected) {
        if (state != expected) {
            revert InvalidState();
        }
        _;
    }

    /// @param seller_ Adresse, die das ETH erhalten soll.
    /// @param arbiter_ Adresse, die im Streitfall erstatten darf.
    /// @dev Drei Rollen muessen verschieden und ungleich `address(0)` sein —
    ///      sonst koennte eine Partei mehrere Rollen halten oder ETH ins Nichts
    ///      gesendet werden.
    constructor(address payable seller_, address arbiter_) {
        if (
            seller_ == address(0) ||
            arbiter_ == address(0) ||
            seller_ == msg.sender ||
            arbiter_ == msg.sender ||
            seller_ == arbiter_
        ) {
            revert InvalidParticipant();
        }
        buyer = msg.sender;
        seller = seller_;
        arbiter = arbiter_;
        state = State.AwaitingPayment;
    }

    /// @notice Hinterlegt ETH in der Treuhand.
    /// @dev `payable` macht die Funktion faehig, ETH zu empfangen; `msg.value`
    ///      ist der mitgesendete Betrag in Wei.
    function deposit()
        external
        payable
        onlyBuyer
        inState(State.AwaitingPayment)
    {
        if (msg.value == 0) {
            revert ZeroDeposit();
        }
        depositAmount = msg.value;
        state = State.AwaitingDelivery;
        emit Deposited(buyer, msg.value);
    }

    /// @notice Buyer bestaetigt die Lieferung — das ETH geht an den Seller.
    /// @dev Checks-Effects-Interactions: erst Zustand setzen, dann ueberweisen.
    ///      So kann ein boesartiger Empfaenger den Aufruf nicht reentrant
    ///      missbrauchen.
    function confirmDelivery()
        external
        onlyBuyer
        inState(State.AwaitingDelivery)
    {
        uint256 amount = depositAmount;
        state = State.Complete;

        (bool success, ) = seller.call{value: amount}("");
        if (!success) {
            revert TransferFailed();
        }
        emit Released(seller, amount);
    }

    /// @notice Arbiter erstattet dem Buyer das hinterlegte ETH.
    function refund() external onlyArbiter inState(State.AwaitingDelivery) {
        uint256 amount = depositAmount;
        state = State.Refunded;

        (bool success, ) = payable(buyer).call{value: amount}("");
        if (!success) {
            revert TransferFailed();
        }
        emit Refunded(buyer, amount);
    }
}
