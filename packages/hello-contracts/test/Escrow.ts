import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { network } from "hardhat";
import { getAddress, parseEther, zeroAddress } from "viem";

describe("Escrow", async () => {
  const { viem } = await network.create();

  // Zustaende der State-Machine (Reihenfolge wie im enum State).
  const State = {
    AwaitingPayment: 0,
    AwaitingDelivery: 1,
    Complete: 2,
    Refunded: 3,
  } as const;

  const DEPOSIT = parseEther("1");

  /** Deployt ein Escrow; Account 0 = Buyer, 1 = Seller, 2 = Arbiter, 3 = Fremder. */
  async function deployEscrow() {
    const [buyer, seller, arbiter, other] = await viem.getWalletClients();
    const escrow = await viem.deployContract("Escrow", [
      seller.account.address,
      arbiter.account.address,
    ]);
    return { escrow, buyer, seller, arbiter, other };
  }

  /** Liefert eine Escrow-Instanz, deren Transaktionen `wallet` signiert. */
  async function escrowAs(
    address: `0x${string}`,
    wallet: Awaited<ReturnType<typeof viem.getWalletClients>>[number],
  ) {
    return viem.getContractAt("Escrow", address, { client: { wallet } });
  }

  describe("Deployment", () => {
    it("startet im Zustand AwaitingPayment", async () => {
      const { escrow } = await deployEscrow();
      assert.equal(await escrow.read.state(), State.AwaitingPayment);
    });
  });

  describe("deposit", () => {
    it("nimmt ETH vom Buyer an und wechselt zu AwaitingDelivery", async () => {
      const { escrow } = await deployEscrow();
      const publicClient = await viem.getPublicClient();

      await escrow.write.deposit({ value: DEPOSIT });

      assert.equal(await escrow.read.state(), State.AwaitingDelivery);
      assert.equal(
        await publicClient.getBalance({ address: escrow.address }),
        DEPOSIT,
      );
    });

    it("revertet, wenn ein Fremder einzahlt", async () => {
      const { escrow, other } = await deployEscrow();
      const escrowAsOther = await escrowAs(escrow.address, other);

      await viem.assertions.revertWithCustomError(
        escrowAsOther.write.deposit({ value: DEPOSIT }),
        escrow,
        "NotBuyer",
      );
    });

    it("revertet bei einer Einzahlung von 0", async () => {
      const { escrow } = await deployEscrow();

      await viem.assertions.revertWithCustomError(
        escrow.write.deposit({ value: 0n }),
        escrow,
        "ZeroDeposit",
      );
    });

    it("revertet bei einer zweiten Einzahlung (falscher Zustand)", async () => {
      const { escrow } = await deployEscrow();
      await escrow.write.deposit({ value: DEPOSIT });

      await viem.assertions.revertWithCustomError(
        escrow.write.deposit({ value: DEPOSIT }),
        escrow,
        "InvalidState",
      );
    });

    it("emittiert Deposited mit Buyer und Betrag", async () => {
      const { escrow, buyer } = await deployEscrow();

      await viem.assertions.emitWithArgs(
        escrow.write.deposit({ value: DEPOSIT }),
        escrow,
        "Deposited",
        [getAddress(buyer.account.address), DEPOSIT],
      );
    });
  });

  describe("Konstruktor-Validierung", () => {
    it("revertet, wenn eine Rolle die Nulladresse ist", async () => {
      const [, , arbiter] = await viem.getWalletClients();

      await assert.rejects(
        viem.deployContract("Escrow", [zeroAddress, arbiter.account.address]),
        /InvalidParticipant/,
      );
    });

    it("revertet, wenn Buyer und Arbiter dieselbe Adresse sind", async () => {
      const [buyer, seller] = await viem.getWalletClients();

      await assert.rejects(
        viem.deployContract("Escrow", [
          seller.account.address,
          buyer.account.address,
        ]),
        /InvalidParticipant/,
      );
    });
  });

  describe("confirmDelivery", () => {
    it("zahlt das ETH an den Seller aus und wechselt zu Complete", async () => {
      const { escrow, seller } = await deployEscrow();
      await escrow.write.deposit({ value: DEPOSIT });

      await viem.assertions.balancesHaveChanged(
        escrow.write.confirmDelivery(),
        [{ address: seller.account.address, amount: DEPOSIT }],
      );

      assert.equal(await escrow.read.state(), State.Complete);
    });

    it("revertet, wenn nicht der Buyer bestaetigt", async () => {
      const { escrow, other } = await deployEscrow();
      await escrow.write.deposit({ value: DEPOSIT });
      const escrowAsOther = await escrowAs(escrow.address, other);

      await viem.assertions.revertWithCustomError(
        escrowAsOther.write.confirmDelivery(),
        escrow,
        "NotBuyer",
      );
    });

    it("revertet, wenn noch nichts eingezahlt wurde", async () => {
      const { escrow } = await deployEscrow();

      await viem.assertions.revertWithCustomError(
        escrow.write.confirmDelivery(),
        escrow,
        "InvalidState",
      );
    });

    it("emittiert Released mit Seller und Betrag", async () => {
      const { escrow, seller } = await deployEscrow();
      await escrow.write.deposit({ value: DEPOSIT });

      await viem.assertions.emitWithArgs(
        escrow.write.confirmDelivery(),
        escrow,
        "Released",
        [getAddress(seller.account.address), DEPOSIT],
      );
    });

    it("revertet bei einem zweiten confirmDelivery (terminaler Zustand)", async () => {
      const { escrow } = await deployEscrow();
      await escrow.write.deposit({ value: DEPOSIT });
      await escrow.write.confirmDelivery();

      await viem.assertions.revertWithCustomError(
        escrow.write.confirmDelivery(),
        escrow,
        "InvalidState",
      );
    });
  });

  describe("refund", () => {
    it("erstattet dem Buyer und wechselt zu Refunded", async () => {
      const { escrow, buyer, arbiter } = await deployEscrow();
      await escrow.write.deposit({ value: DEPOSIT });
      const escrowAsArbiter = await escrowAs(escrow.address, arbiter);

      await viem.assertions.balancesHaveChanged(
        escrowAsArbiter.write.refund(),
        [{ address: buyer.account.address, amount: DEPOSIT }],
      );

      assert.equal(await escrow.read.state(), State.Refunded);
    });

    it("revertet, wenn nicht der Arbiter erstattet", async () => {
      const { escrow } = await deployEscrow();
      await escrow.write.deposit({ value: DEPOSIT });

      await viem.assertions.revertWithCustomError(
        escrow.write.refund(),
        escrow,
        "NotArbiter",
      );
    });

    it("emittiert Refunded mit Buyer und Betrag", async () => {
      const { escrow, buyer, arbiter } = await deployEscrow();
      await escrow.write.deposit({ value: DEPOSIT });
      const escrowAsArbiter = await escrowAs(escrow.address, arbiter);

      await viem.assertions.emitWithArgs(
        escrowAsArbiter.write.refund(),
        escrow,
        "Refunded",
        [getAddress(buyer.account.address), DEPOSIT],
      );
    });

    it("revertet nach bereits bestaetigter Lieferung (terminaler Zustand)", async () => {
      const { escrow, arbiter } = await deployEscrow();
      await escrow.write.deposit({ value: DEPOSIT });
      await escrow.write.confirmDelivery();
      const escrowAsArbiter = await escrowAs(escrow.address, arbiter);

      await viem.assertions.revertWithCustomError(
        escrowAsArbiter.write.refund(),
        escrow,
        "InvalidState",
      );
    });
  });
});
