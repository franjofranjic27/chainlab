// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Burnable} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title ChainlabToken — der eigene Coin des chainlab-Labs
/// @notice Ein fungibler ERC-20-Token (Symbol: CLAB) zum Lernen, wie "Coins"
///         auf Ethereum technisch funktionieren.
/// @dev Kombiniert drei OpenZeppelin-Bausteine:
///      - ERC20:         Standard fuer fungible Token (transfer, approve, allowance).
///      - ERC20Burnable: erlaubt Haltern, eigene Token zu vernichten (burn).
///      - Ownable:       Access Control — nur der Owner darf neue Token minten.
contract ChainlabToken is ERC20, ERC20Burnable, Ownable {
    /// @param initialSupply Menge an Token (in der kleinsten Einheit, 18 Decimals),
    ///        die beim Deploy erzeugt wird.
    /// @param initialOwner Adresse, die Owner wird und das Initial-Supply erhaelt.
    constructor(uint256 initialSupply, address initialOwner)
        ERC20("Chainlab Token", "CLAB")
        Ownable(initialOwner)
    {
        _mint(initialOwner, initialSupply);
    }

    /// @notice Erzeugt neue Token und schreibt sie `to` gut.
    /// @dev Nur der Owner darf minten — ohne Obergrenze (kein Cap).
    /// @param to Empfaenger der neuen Token.
    /// @param amount Menge in der kleinsten Einheit (18 Decimals).
    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }
}
