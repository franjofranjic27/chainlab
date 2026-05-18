// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title SimpleStorage — ein Wert, der dauerhaft on-chain liegt
/// @notice Speichert eine Zahl und merkt sich, wer sie zuletzt gesetzt hat.
/// @dev Demonstriert den Unterschied zwischen `private` und `public` Storage,
///      `msg.sender` (die aufrufende Adresse) und `view`-Funktionen (nur lesen,
///      kosten beim externen Aufruf kein Gas).
contract SimpleStorage {
    /// @dev `private` bedeutet: keine automatische Getter-Funktion. Der Wert
    ///      ist on-chain trotzdem sichtbar — `private` ist Sichtbarkeit im
    ///      Solidity-Code, keine Geheimhaltung. Hier bewusst mit manuellem
    ///      `get()`, um den Kontrast zum `public`-Auto-Getter von
    ///      `lastUpdatedBy` zu zeigen.
    uint256 private _value;

    /// @notice Adresse, die `set` zuletzt aufgerufen hat. `public` => Auto-Getter.
    address public lastUpdatedBy;

    /// @notice Wird bei jeder Wertaenderung emittiert.
    event ValueChanged(uint256 newValue, address indexed by);

    /// @notice Speichert einen neuen Wert.
    /// @dev `msg.sender` ist die Adresse, die diese Transaktion gesendet hat.
    /// @param newValue Der zu speichernde Wert.
    function set(uint256 newValue) external {
        _value = newValue;
        lastUpdatedBy = msg.sender;
        emit ValueChanged(newValue, msg.sender);
    }

    /// @notice Liest den gespeicherten Wert.
    /// @dev `view` => die Funktion aendert keinen State. Reine Lese-Aufrufe
    ///      laufen lokal beim Node und kosten kein Gas.
    function get() external view returns (uint256) {
        return _value;
    }
}
