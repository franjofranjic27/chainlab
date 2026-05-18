import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { network } from "hardhat";
import { getAddress, parseEther } from "viem";

/**
 * Tests fuer den ChainlabToken.
 *
 * Hardhat 3 fuehrt diese Datei mit dem node:test-Runner aus. `network.create()`
 * oeffnet eine frische, in-process simulierte Chain — jeder Test startet sauber.
 */
describe("ChainlabToken", async () => {
  const { viem } = await network.create();

  // 1.000.000 CLAB in der kleinsten Einheit (18 Decimals).
  const INITIAL_SUPPLY = parseEther("1000000");

  /** Deployt einen frischen Token, dessen Owner der erste Wallet-Account ist. */
  async function deployToken() {
    const [owner, alice, bob] = await viem.getWalletClients();
    const token = await viem.deployContract("ChainlabToken", [
      INITIAL_SUPPLY,
      owner.account.address,
    ]);
    return { token, owner, alice, bob };
  }

  /** Liefert eine Contract-Instanz, deren Transaktionen `wallet` signiert. */
  async function tokenAs(
    address: `0x${string}`,
    wallet: Awaited<ReturnType<typeof viem.getWalletClients>>[number],
  ) {
    return viem.getContractAt("ChainlabToken", address, {
      client: { wallet },
    });
  }

  describe("Deployment", () => {
    it("setzt Name, Symbol und Decimals", async () => {
      const { token } = await deployToken();
      assert.equal(await token.read.name(), "Chainlab Token");
      assert.equal(await token.read.symbol(), "CLAB");
      assert.equal(await token.read.decimals(), 18);
    });

    it("mintet das Initial-Supply an den Owner", async () => {
      const { token, owner } = await deployToken();
      assert.equal(await token.read.totalSupply(), INITIAL_SUPPLY);
      assert.equal(
        await token.read.balanceOf([owner.account.address]),
        INITIAL_SUPPLY,
      );
    });

    it("setzt den Owner korrekt", async () => {
      const { token, owner } = await deployToken();
      assert.equal(
        getAddress(await token.read.owner()),
        getAddress(owner.account.address),
      );
    });
  });

  describe("transfer", () => {
    it("verschiebt Token zwischen Accounts", async () => {
      const { token, owner, alice } = await deployToken();
      const amount = parseEther("100");

      await token.write.transfer([alice.account.address, amount]);

      assert.equal(
        await token.read.balanceOf([alice.account.address]),
        amount,
      );
      assert.equal(
        await token.read.balanceOf([owner.account.address]),
        INITIAL_SUPPLY - amount,
      );
    });

    it("emittiert ein Transfer-Event", async () => {
      const { token, owner, alice } = await deployToken();
      const amount = parseEther("1");

      await viem.assertions.emitWithArgs(
        token.write.transfer([alice.account.address, amount]),
        token,
        "Transfer",
        [
          getAddress(owner.account.address),
          getAddress(alice.account.address),
          amount,
        ],
      );
    });

    it("revertet bei zu geringem Guthaben", async () => {
      const { token, alice, bob } = await deployToken();
      const aliceToken = await tokenAs(token.address, alice);

      await viem.assertions.revertWithCustomError(
        aliceToken.write.transfer([bob.account.address, parseEther("1")]),
        token,
        "ERC20InsufficientBalance",
      );
    });
  });

  describe("mint", () => {
    it("laesst den Owner neue Token erzeugen", async () => {
      const { token, alice } = await deployToken();
      const amount = parseEther("500");

      await token.write.mint([alice.account.address, amount]);

      assert.equal(
        await token.read.balanceOf([alice.account.address]),
        amount,
      );
      assert.equal(await token.read.totalSupply(), INITIAL_SUPPLY + amount);
    });

    it("revertet, wenn ein Fremder minten will", async () => {
      const { token, alice } = await deployToken();
      const aliceToken = await tokenAs(token.address, alice);

      await viem.assertions.revertWithCustomError(
        aliceToken.write.mint([alice.account.address, parseEther("1")]),
        token,
        "OwnableUnauthorizedAccount",
      );
    });
  });

  describe("burn", () => {
    it("reduziert Guthaben und Total-Supply", async () => {
      const { token, owner } = await deployToken();
      const amount = parseEther("250");

      await token.write.burn([amount]);

      assert.equal(
        await token.read.balanceOf([owner.account.address]),
        INITIAL_SUPPLY - amount,
      );
      assert.equal(await token.read.totalSupply(), INITIAL_SUPPLY - amount);
    });

    it("revertet beim Verbrennen von mehr als dem Guthaben", async () => {
      const { token, alice } = await deployToken();
      const aliceToken = await tokenAs(token.address, alice);

      await viem.assertions.revertWithCustomError(
        aliceToken.write.burn([parseEther("1")]),
        token,
        "ERC20InsufficientBalance",
      );
    });

    it("erlaubt burnFrom bis zur genehmigten Menge", async () => {
      const { token, owner, alice } = await deployToken();
      const amount = parseEther("100");

      await token.write.approve([alice.account.address, amount]);
      const aliceToken = await tokenAs(token.address, alice);
      await aliceToken.write.burnFrom([owner.account.address, amount]);

      assert.equal(
        await token.read.balanceOf([owner.account.address]),
        INITIAL_SUPPLY - amount,
      );
      assert.equal(await token.read.totalSupply(), INITIAL_SUPPLY - amount);
      assert.equal(
        await token.read.allowance([
          owner.account.address,
          alice.account.address,
        ]),
        0n,
      );
    });
  });

  describe("Allowances", () => {
    it("erlaubt transferFrom bis zur genehmigten Menge", async () => {
      const { token, owner, alice, bob } = await deployToken();
      const allowance = parseEther("300");

      await token.write.approve([alice.account.address, allowance]);
      assert.equal(
        await token.read.allowance([
          owner.account.address,
          alice.account.address,
        ]),
        allowance,
      );

      const aliceToken = await tokenAs(token.address, alice);
      await aliceToken.write.transferFrom([
        owner.account.address,
        bob.account.address,
        allowance,
      ]);

      assert.equal(
        await token.read.balanceOf([bob.account.address]),
        allowance,
      );
      assert.equal(
        await token.read.allowance([
          owner.account.address,
          alice.account.address,
        ]),
        0n,
      );
    });

    it("revertet, wenn die Allowance ueberschritten wird", async () => {
      const { token, owner, alice, bob } = await deployToken();

      await token.write.approve([alice.account.address, parseEther("10")]);
      const aliceToken = await tokenAs(token.address, alice);

      await viem.assertions.revertWithCustomError(
        aliceToken.write.transferFrom([
          owner.account.address,
          bob.account.address,
          parseEther("11"),
        ]),
        token,
        "ERC20InsufficientAllowance",
      );
    });
  });
});
