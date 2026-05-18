// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title Counter — der einfachste denkbare Smart Contract
/// @notice Ein hochzaehlbarer Zaehler. Zeigt die Grundbausteine: eine
///         State-Variable, Funktionen, die sie aendern, Events und Custom Errors.
/// @dev `count` ist `public` — Solidity erzeugt dafuer automatisch eine
///      gleichnamige Getter-Funktion. Ein separates `get()` ist unnoetig.
contract Counter {
    /// @notice Aktueller Zaehlerstand. Liegt dauerhaft im Contract-Storage.
    uint256 public count;

    /// @notice Wird bei jeder Aenderung von `count` emittiert.
    /// @dev `indexed` macht `by` in Logs filterbar (z. B. fuer Frontends).
    event CountChanged(uint256 newCount, address indexed by);

    /// @dev Custom Errors sind gas-guenstiger als `require` mit String und
    ///      lassen sich vom Aufrufer typsicher auswerten.
    error CounterUnderflow();

    /// @notice Erhoeht den Zaehler um 1.
    function increment() external {
        count += 1;
        emit CountChanged(count, msg.sender);
    }

    /// @notice Verringert den Zaehler um 1.
    /// @dev Ab Solidity 0.8 reverten Unterlaeufe zwar automatisch — der
    ///      explizite Check liefert aber eine aussagekraeftige Fehlermeldung.
    function decrement() external {
        if (count == 0) {
            revert CounterUnderflow();
        }
        count -= 1;
        emit CountChanged(count, msg.sender);
    }

    /// @notice Setzt den Zaehler zurueck auf 0.
    function reset() external {
        count = 0;
        emit CountChanged(count, msg.sender);
    }
}
