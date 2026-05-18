import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { network } from "hardhat";
import { getAddress } from "viem";

describe("Voting", async () => {
  const { viem, networkHelpers } = await network.create();

  // Standard-Laufzeit der Abstimmung in den Tests: 1 Stunde.
  const ONE_HOUR = 3600n;

  /** Deployt ein Voting; der erste Wallet-Account wird Chairperson. */
  async function deployVoting(durationSeconds: bigint = ONE_HOUR) {
    const [chairperson, alice, bob] = await viem.getWalletClients();
    const voting = await viem.deployContract("Voting", [durationSeconds]);
    return { voting, chairperson, alice, bob };
  }

  /** Liefert eine Voting-Instanz, deren Transaktionen `wallet` signiert. */
  async function votingAs(
    address: `0x${string}`,
    wallet: Awaited<ReturnType<typeof viem.getWalletClients>>[number],
  ) {
    return viem.getContractAt("Voting", address, { client: { wallet } });
  }

  describe("Proposals anlegen", () => {
    it("setzt den Deployer als Chairperson", async () => {
      const { voting, chairperson } = await deployVoting();
      assert.equal(
        (await voting.read.chairperson()).toLowerCase(),
        chairperson.account.address.toLowerCase(),
      );
    });

    it("laesst den Chairperson Proposals anlegen", async () => {
      const { voting } = await deployVoting();

      await voting.write.addProposal(["Pizza"]);
      await voting.write.addProposal(["Pasta"]);

      assert.equal(await voting.read.proposalCount(), 2n);
    });

    it("revertet, wenn ein Fremder ein Proposal anlegen will", async () => {
      const { voting, alice } = await deployVoting();
      const votingAsAlice = await votingAs(voting.address, alice);

      await viem.assertions.revertWithCustomError(
        votingAsAlice.write.addProposal(["Sushi"]),
        voting,
        "NotChairperson",
      );
    });

    it("emittiert ProposalAdded mit Id und Name", async () => {
      const { voting } = await deployVoting();

      await viem.assertions.emitWithArgs(
        voting.write.addProposal(["Pizza"]),
        voting,
        "ProposalAdded",
        [0n, "Pizza"],
      );
    });
  });

  describe("Abstimmen", () => {
    it("zaehlt eine Stimme dem Proposal zu", async () => {
      const { voting, alice } = await deployVoting();
      await voting.write.addProposal(["Pizza"]);

      const votingAsAlice = await votingAs(voting.address, alice);
      await votingAsAlice.write.vote([0n]);

      const [, voteCount] = await voting.read.proposals([0n]);
      assert.equal(voteCount, 1n);
      assert.equal(await voting.read.hasVoted([alice.account.address]), true);
    });

    it("revertet bei doppelter Stimme derselben Adresse", async () => {
      const { voting, alice } = await deployVoting();
      await voting.write.addProposal(["Pizza"]);

      const votingAsAlice = await votingAs(voting.address, alice);
      await votingAsAlice.write.vote([0n]);

      await viem.assertions.revertWithCustomError(
        votingAsAlice.write.vote([0n]),
        voting,
        "AlreadyVoted",
      );
    });

    it("revertet bei ungueltiger Proposal-ID", async () => {
      const { voting, alice } = await deployVoting();
      await voting.write.addProposal(["Pizza"]);

      const votingAsAlice = await votingAs(voting.address, alice);
      await viem.assertions.revertWithCustomError(
        votingAsAlice.write.vote([99n]),
        voting,
        "InvalidProposal",
      );
    });

    it("meldet InvalidProposal vor AlreadyVoted bei ungueltiger ID", async () => {
      const { voting, alice } = await deployVoting();
      await voting.write.addProposal(["Pizza"]);

      const votingAsAlice = await votingAs(voting.address, alice);
      await votingAsAlice.write.vote([0n]);

      // Bereits gewaehlte Adresse + ungueltige ID => Input-Check schlaegt zuerst zu.
      await viem.assertions.revertWithCustomError(
        votingAsAlice.write.vote([99n]),
        voting,
        "InvalidProposal",
      );
    });

    it("emittiert Voted mit Waehler und Proposal-Id", async () => {
      const { voting, alice } = await deployVoting();
      await voting.write.addProposal(["Pizza"]);

      const votingAsAlice = await votingAs(voting.address, alice);
      await viem.assertions.emitWithArgs(
        votingAsAlice.write.vote([0n]),
        voting,
        "Voted",
        [getAddress(alice.account.address), 0n],
      );
    });

    it("revertet, sobald die Deadline ueberschritten ist", async () => {
      const { voting, alice } = await deployVoting();
      await voting.write.addProposal(["Pizza"]);

      // Zeit ueber die Deadline hinaus vorspulen.
      await networkHelpers.time.increase(ONE_HOUR + 1n);

      const votingAsAlice = await votingAs(voting.address, alice);
      await viem.assertions.revertWithCustomError(
        votingAsAlice.write.vote([0n]),
        voting,
        "VotingClosed",
      );
    });
  });

  describe("winningProposalName", () => {
    it("liefert das Proposal mit den meisten Stimmen", async () => {
      const { voting, alice, bob } = await deployVoting();
      await voting.write.addProposal(["Pizza"]);
      await voting.write.addProposal(["Pasta"]);

      await (await votingAs(voting.address, alice)).write.vote([1n]);
      await (await votingAs(voting.address, bob)).write.vote([1n]);

      assert.equal(await voting.read.winningProposalName(), "Pasta");
    });

    it("revertet, wenn es keine Proposals gibt", async () => {
      const { voting } = await deployVoting();

      await viem.assertions.revertWithCustomError(
        voting.read.winningProposalName(),
        voting,
        "NoProposals",
      );
    });
  });
});
