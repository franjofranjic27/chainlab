import { describe, it } from "node:test";
import assert from "node:assert/strict";

import { network } from "hardhat";
import { getAddress } from "viem";

describe("Counter", async () => {
  const { viem } = await network.create();

  it("startet bei 0", async () => {
    const counter = await viem.deployContract("Counter");
    assert.equal(await counter.read.count(), 0n);
  });

  it("zaehlt mit increment hoch", async () => {
    const counter = await viem.deployContract("Counter");

    await counter.write.increment();
    await counter.write.increment();

    assert.equal(await counter.read.count(), 2n);
  });

  it("zaehlt mit decrement herunter", async () => {
    const counter = await viem.deployContract("Counter");

    await counter.write.increment();
    await counter.write.decrement();

    assert.equal(await counter.read.count(), 0n);
  });

  it("setzt mit reset auf 0 zurueck", async () => {
    const counter = await viem.deployContract("Counter");

    await counter.write.increment();
    await counter.write.increment();
    await counter.write.reset();

    assert.equal(await counter.read.count(), 0n);
  });

  it("emittiert CountChanged mit neuem Stand und Aufrufer", async () => {
    const counter = await viem.deployContract("Counter");
    const [wallet] = await viem.getWalletClients();

    await viem.assertions.emitWithArgs(
      counter.write.increment(),
      counter,
      "CountChanged",
      [1n, getAddress(wallet.account.address)],
    );
  });

  it("revertet mit CounterUnderflow beim Dekrementieren von 0", async () => {
    const counter = await viem.deployContract("Counter");

    await viem.assertions.revertWithCustomError(
      counter.write.decrement(),
      counter,
      "CounterUnderflow",
    );
  });
});
