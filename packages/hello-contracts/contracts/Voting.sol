// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title Voting — eine minimale On-Chain-Abstimmung
/// @notice Der Chairperson legt Proposals an, jede Adresse hat genau eine Stimme,
///         und die Abstimmung schliesst nach einer Frist.
/// @dev Demonstriert `struct`, dynamisches Array, `mapping`, `modifier`,
///      `immutable` und Zeit-Logik ueber `block.timestamp` — Access Control
///      komplett von Hand (ohne OpenZeppelin).
contract Voting {
    /// @dev Ein Wahlvorschlag: Name plus laufender Stimmenzaehler.
    struct Proposal {
        string name;
        uint256 voteCount;
    }

    /// @notice Adresse, die Proposals anlegen darf. `immutable`: einmal im
    ///         Konstruktor gesetzt, danach unveraenderlich (gas-guenstig).
    address public immutable chairperson;

    /// @notice Unix-Zeitstempel, ab dem keine Stimmen mehr angenommen werden.
    /// @dev `block.timestamp` ist von Validatoren um wenige Sekunden
    ///      beeinflussbar — fuer realistische Fristen unkritisch.
    uint256 public immutable votingDeadline;

    /// @notice Alle Wahlvorschlaege. `public` => Auto-Getter `proposals(uint256)`.
    Proposal[] public proposals;

    /// @notice Ob eine Adresse bereits abgestimmt hat.
    mapping(address => bool) public hasVoted;

    event ProposalAdded(uint256 indexed proposalId, string name);
    event Voted(address indexed voter, uint256 indexed proposalId);

    error NotChairperson();
    error AlreadyVoted();
    error InvalidProposal();
    error VotingClosed();
    error NoProposals();

    /// @dev Modifier kapseln wiederkehrende Vorbedingungen. `_;` markiert die
    ///      Stelle, an der der eigentliche Funktionsrumpf ausgefuehrt wird.
    modifier onlyChairperson() {
        if (msg.sender != chairperson) {
            revert NotChairperson();
        }
        _;
    }

    modifier whileVotingOpen() {
        if (block.timestamp >= votingDeadline) {
            revert VotingClosed();
        }
        _;
    }

    /// @param votingDurationSeconds Laufzeit der Abstimmung ab Deployment.
    constructor(uint256 votingDurationSeconds) {
        chairperson = msg.sender;
        votingDeadline = block.timestamp + votingDurationSeconds;
    }

    /// @notice Legt einen neuen Wahlvorschlag an. Nur der Chairperson.
    /// @param name Bezeichnung des Vorschlags.
    function addProposal(string calldata name) external onlyChairperson {
        proposals.push(Proposal({name: name, voteCount: 0}));
        emit ProposalAdded(proposals.length - 1, name);
    }

    /// @notice Gibt eine Stimme fuer einen Vorschlag ab. Eine Stimme pro Adresse.
    /// @param proposalId Index des Vorschlags in `proposals`.
    function vote(uint256 proposalId) external whileVotingOpen {
        // Input-Validierung vor dem Zustands-Check: eine ungueltige ID soll
        // immer `InvalidProposal` liefern, unabhaengig vom Wahl-Status.
        if (proposalId >= proposals.length) {
            revert InvalidProposal();
        }
        if (hasVoted[msg.sender]) {
            revert AlreadyVoted();
        }

        hasVoted[msg.sender] = true;
        proposals[proposalId].voteCount += 1;

        emit Voted(msg.sender, proposalId);
    }

    /// @notice Anzahl der angelegten Vorschlaege.
    function proposalCount() external view returns (uint256) {
        return proposals.length;
    }

    /// @notice Name des Vorschlags mit den meisten Stimmen.
    /// @dev Bei Gleichstand gewinnt der zuerst angelegte Vorschlag.
    function winningProposalName() external view returns (string memory) {
        if (proposals.length == 0) {
            revert NoProposals();
        }

        uint256 winningId = 0;
        uint256 highestCount = proposals[0].voteCount;
        for (uint256 i = 1; i < proposals.length; i++) {
            if (proposals[i].voteCount > highestCount) {
                highestCount = proposals[i].voteCount;
                winningId = i;
            }
        }
        return proposals[winningId].name;
    }
}
