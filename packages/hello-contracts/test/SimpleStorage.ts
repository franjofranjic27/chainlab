import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { network } from "hardhat";
import { getAddress, zeroAddress } from "viem";

describe("SimpleStorage", async () => {
  const { viem } = await network.create();

  it("liefert anfangs den Wert 0", async () => {
    const storage = await viem.deployContract("SimpleStorage");
    assert.equal(await storage.read.get(), 0n);
  });

  it("speichert und liest einen Wert", async () => {
    const storage = await viem.deployContract("SimpleStorage");

    await storage.write.set([42n]);

    assert.equal(await storage.read.get(), 42n);
  });

  it("merkt sich den Aufrufer in lastUpdatedBy", async () => {
    const storage = await viem.deployContract("SimpleStorage");
    const [, alice] = await viem.getWalletClients();

    assert.equal(await storage.read.lastUpdatedBy(), zeroAddress);

    const storageAsAlice = await viem.getContractAt(
      "SimpleStorage",
      storage.address,
      { client: { wallet: alice } },
    );
    await storageAsAlice.write.set([7n]);

    assert.equal(
      getAddress(await storage.read.lastUpdatedBy()),
      getAddress(alice.account.address),
    );
  });

  it("emittiert ValueChanged mit neuem Wert und Aufrufer", async () => {
    const storage = await viem.deployContract("SimpleStorage");
    const [wallet] = await viem.getWalletClients();

    await viem.assertions.emitWithArgs(
      storage.write.set([99n]),
      storage,
      "ValueChanged",
      [99n, getAddress(wallet.account.address)],
    );
  });
});
