import mocha from "mocha";
import chai from "chai";
import * as json2xml from "../index";
const cshould = chai.should();

describe("Parsing Xml to Json", () => {
  it("Should parse a simple xml string", () => {
    let xml = '<data id="3"></data>';
    const parser = new window.DOMParser();
    let obj = json2xml.parse(parser.parseFromString(xml, "text/xml"));
    obj.should.have.a.property("data");
    obj.data.should.have.a.property("id").eq("3");
  });
  it("Should parse a simple xml string & camel case attribute name", () => {
    let xml = '<data id-obj="3"></data>';
    const parser = new window.DOMParser();
    let obj = json2xml.parse(parser.parseFromString(xml, "text/xml"));
    obj.should.have.a.property("data");
    obj.data.should.have.a.property("idObj").eq("3");
  });
  it("Should parse a simple xml string & escape value", () => {
    let xml = '<data id-obj="&amp;bonj&quot;&lt;&gt;&quot;our"></data>';
    const parser = new window.DOMParser();
    let obj = json2xml.parse(parser.parseFromString(xml, "text/xml"));
    obj.should.have.a.property("data");
    obj.data.should.have.a.property("idObj").eq('&bonj"<>"our');
  });
  it("Should parse a xml string", () => {
    let xml = '<data id="3"><custom><value lang="fr"/></custom></data>';
    const parser = new window.DOMParser();
    let obj = json2xml.parse(parser.parseFromString(xml, "text/xml"));
    obj.should.have.a.property("data");
    obj.data.should.have.a.property("id").eq("3");
    obj.data.should.have.a.property("custom");
    obj.data.custom.should.have.a.property("value");
    obj.data.custom.value.should.have.a.property("lang").eq("fr");
  });
  it("Should parse a xml string with registry", () => {
    let xml = '<data id="3"><custom><value lang="fr"/></custom></data>';
    const parser = new window.DOMParser();
    const registry = {
      data: function() {
        const self = this;
        Object.defineProperties(self, {
          _id: {
            value: 0,
            enumerable: false,
            writable: true
          },
          id: {
            get: () => self._id,
            set: v => {
              self._id = +v;
            } // for demo, convert to int
          }
        });
      }
    };
    let obj = json2xml.parse(parser.parseFromString(xml, "text/xml"), registry);
    obj.should.have.a.property("data");
    obj.data.should.have.a.property("id").eq(3); // should be an integer now
    obj.data.should.have.a.property("custom");
    obj.data.custom.should.have.a.property("value");
    obj.data.custom.value.should.have.a.property("lang").eq("fr");
  });
  it("Should parse a xml string with registry and namespaces", () => {
    let xml =
      '<data id="3"><custom><value namespace="ns2" lang="fr"/></custom></data>';
    const parser = new window.DOMParser();
    const registry = {
      data: function() {
        const self = this;
        Object.defineProperties(self, {
          _id: {
            value: 0,
            enumerable: false,
            writable: true
          },
          id: {
            get: () => self._id,
            set: v => {
              self._id = +v;
            } // for demo, convert to int
          }
        });
      },
      "ns2:value": function() {
        const self = this;
        Object.defineProperties(self, {
          _lang: {
            value: "",
            enumerable: false,
            writable: true
          },
          lang: {
            get: () => self._lang,
            set: v => {
              if (v === "fr") self._lang = "Francais";
              else self._lang = v;
            }
          }
        });
      }
    };
    let obj = json2xml.parse(parser.parseFromString(xml, "text/xml"), registry);
    obj.should.have.a.property("data");
    obj.data.should.have.a.property("id").eq(3); // should be an integer now
    obj.data.should.have.a.property("custom");
    obj.data.custom.should.have.a.property("value");
    obj.data.custom.value.should.have.a.property("lang").eq("Francais");
  });
  it("Should parse a simple xml string with a string", () => {
    let xml = '<data id="3">just a simple text</data>';
    const parser = new window.DOMParser();
    let obj = json2xml.parse(parser.parseFromString(xml, "text/xml"));
    obj.should.have.a.property("data");
    obj.data.id.should.eq("3"); // should not finding property????
    obj.data.should.eq("just a simple text");
  });
  it("Should parse a simple xml string with a number", () => {
    let xml = '<data id="3">24.5</data>';
    const parser = new window.DOMParser();
    const r = {
      data: Number
    };
    let obj = json2xml.parse(parser.parseFromString(xml, "text/xml"), r);
    obj.should.have.a.property("data");
    obj.data.id.should.eq("3"); // should not finding property????
    obj.data.should.eq(24.5);
  });
  it("Should parse a xml string with array of Numbers with custom attributes", () => {
    let xml = '<datas id="3"><data>2.32</data><data>12</data></datas>';
    const parser = new window.DOMParser();
    const r = {
      data: Number
    };
    let obj = json2xml.parse(parser.parseFromString(xml, "text/xml"), r);
    obj.should.have.a.property("datas");
    obj.datas.id.should.eq("3"); // should not finding property????
    obj.datas.length.should.eq(2);
    obj.datas[0].should.eq(2.32);
    obj.datas[1].should.eq(12);
  });
  it("Should parse a xml string with array of string in a property", () => {
    let xml = '<datas id="3"><arr>2.32</arr><arr>12</arr></datas>';
    const parser = new window.DOMParser();
    let obj = json2xml.parse(parser.parseFromString(xml, "text/xml"));
    obj.should.have.a.property("datas");
    obj.datas.should.have.a.property("arr");
    obj.datas.arr.should.have.a.property("length").eq(2);
    obj.datas.arr[0].should.eq("2.32");
    obj.datas.arr[1].should.eq("12");
  });
});
