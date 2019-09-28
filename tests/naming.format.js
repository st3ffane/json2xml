import mocha from "mocha";
import chai from "chai";
import * as format from "../src/naming.format";
const cshould = chai.should();

describe("Testing naming formatter: uncamelcase name", () => {
  it("Should return empty name for undefined/null", () => {
    let test = format.unCamelCaseName();
    test.should.eq("");
  });
  it('Should return same name for "mynode"', () => {
    let test = format.unCamelCaseName("mynode");
    test.should.eq("mynode");
  });
  it('Should return same name for "my-node"', () => {
    let test = format.unCamelCaseName("my-node");
    test.should.eq("my-node");
  });
  it('Should return formatted name for "myNode"', () => {
    let test = format.unCamelCaseName("myNode");
    test.should.eq("my-node");
  });
  it('Should return formatted name for "myNodeIsGreat"', () => {
    let test = format.unCamelCaseName("myNodeIsGreat");
    test.should.eq("my-node-is-great");
  });
  it('Should return formatted name for "myNodeAndIIsGreat"', () => {
    let test = format.unCamelCaseName("myNodeAndIIsGreat");
    test.should.eq("my-node-and-i-is-great");
  });
  it('Should return formatted name for "MyNodeAndIIsGreat"', () => {
    let test = format.unCamelCaseName("MyNodeAndIIsGreat");
    test.should.eq("my-node-and-i-is-great");
  });
});
describe("Testing naming formatter: camelcase name", () => {
  it("Should return empty string for no name", () => {
    let test = format.camelCaseName();
    test.should.eq("");
  });
  it('Should return same name for "mynode"', () => {
    let test = format.camelCaseName("mynode");
    test.should.eq("mynode");
  });
  it('Should return formatted name for "my-node"', () => {
    let test = format.camelCaseName("my-node");
    test.should.eq("myNode");
  });
  it('Should return formatted name for "my-node-is-great"', () => {
    let test = format.camelCaseName("my-node-is-great");
    test.should.eq("myNodeIsGreat");
  });
  it('Should return formatted name for "my-node-and-i-is-great"', () => {
    let test = format.camelCaseName("my-node-and-i-is-great");
    test.should.eq("myNodeAndIIsGreat");
  });
});
