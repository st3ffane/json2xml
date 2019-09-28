import mocha from "mocha";
import chai from "chai";
import * as json2xml from "../index";
const cshould = chai.should();

describe("Stringify an object to xml string", () => {
  it("Should return empty string if no object is passed", () => {
    let test = json2xml.stringify();
    test.should.eq("");
  });
  it("Should return value string if not object nor array", () => {
    let test = json2xml.stringify(12);
    test.should.eq("12");
  });
  it("Should return value string escaped", () => {
    let test = json2xml.stringify('&bonj"<>"our');
    test.should.eq("&amp;bonj&quot;&lt;&gt;&quot;our");
  });
  it("Should return a simple object parsed", () => {
    let obj = {
      namespace: "my:namespace",
      id: "anid"
    };
    let test = json2xml.stringify(obj);
    test.should.eq('<object namespace="my:namespace" id="anid"/>');
  });
  it("Should return a simple named object parsed", () => {
    class MyData {
      constructor(id, name) {
        this.id = id;
        this.name = name;
      }
    }
    let obj = new MyData("anId", "aName");
    let test = json2xml.stringify(obj);
    test.should.eq('<my-data id="anId" name="aName"/>');
  });
  it("Should return a simple array", () => {
    class MyData {
      constructor(id, name) {
        this.id = id;
        this.name = name;
      }
    }
    let obj = [new MyData("anId", "aName")];
    let test = json2xml.stringify(obj, undefined, "datas");
    test.should.eq('<datas><data id="anId" name="aName"/></datas>');
  });
  it("Should return a simple named array", () => {
    class MyData {
      constructor(id, name) {
        this.id = id;
        this.name = name;
      }
    }
    let obj = [new MyData("anId", "aName")];
    let test = json2xml.stringify(obj, undefined, "myDatas");
    test.should.eq('<my-datas><my-data id="anId" name="aName"/></my-datas>');
  });
  it("Should return a simple named object parsed without empty or null props", () => {
    class MyData {
      constructor(id, name) {
        this.id = id;
        this.name = name;
        this.value1 = undefined;
        this.value2 = "";
        this.value3 = null;
      }
    }
    let obj = new MyData("anId", "aName");
    let test = json2xml.stringify(obj);
    test.should.eq('<my-data id="anId" name="aName"/>');
  });
  it("Should return a simple named object parsed with empty or null props", () => {
    class MyData {
      constructor(id, name) {
        this.id = id;
        this.name = name;
        this.value1 = undefined;
        this.value2 = "";
        this.value3 = null;
      }
    }
    let obj = new MyData("anId", "aName");
    let test = json2xml.stringify(obj, { preserveEmptyOrNull: true });
    test.should.eq(
      '<my-data id="anId" name="aName" value1="" value2="" value3=""/>'
    );
  });
  it("Should return a named object parsed with inner object", () => {
    class MyData {
      constructor(id, name) {
        this.id = id;
        this.name = name;
        this.value1 = undefined;
        this.value2 = "";
        this.value3 = null;
      }
    }
    class MyNode {
      constructor(id, name) {
        this.id = id;
        this.name = name;
        this.data = new MyData("otherId", "othername");
      }
    }
    let obj = new MyNode("anId", "aName");
    let test = json2xml.stringify(obj, { preserveEmptyOrNull: false });
    test.should.eq(
      '<my-node id="anId" name="aName"><data id="otherId" name="othername"/></my-node>'
    );
  });
  it("Should return a named object parsed with inner array of objects", () => {
    class MyData {
      constructor(id, name) {
        this.id = id;
        this.name = name;
        this.value1 = undefined;
        this.value2 = "";
        this.value3 = null;
      }
    }
    class MyNode {
      constructor(id, name) {
        this.id = id;
        this.name = name;
        this.datas = [
          new MyData("otherId", "othername"),
          new MyData("otherId2", "othername2")
        ];
      }
    }
    let obj = new MyNode("anId", "aName");
    let test = json2xml.stringify(obj, { preserveEmptyOrNull: false });
    test.should.eq(
      '<my-node id="anId" name="aName"><datas><data id="otherId" name="othername"/><data id="otherId2" name="othername2"/></datas></my-node>'
    );
  });
  it("Should return a textNode", () => {
    let obj = new String("my string value");
    obj.id = "anId";
    obj.namespace = "a namespace";
    let test = json2xml.stringify(obj);
    test.should.eq(
      '<string id="anId" namespace="a namespace">my string value</string>'
    );
  });
  it("Should return a textNode and a number", () => {
    let obj = new String("my string value");
    obj.id = "anId";
    obj.namespace = "a namespace";
    let v = new Number(25);
    v.id = "hello";
    let t = {
      myString: obj,
      myValue: v
    };
    let test = json2xml.stringify(t, undefined, "myXml");
    test.should.eq(
      '<my-xml><my-string id="anId" namespace="a namespace">my string value</my-string><my-value id="hello">25</my-value></my-xml>'
    );
  });
  it("Should return a array with custom node attributes", () => {
    let obj = new Array("text", "other", 3);
    obj.id = "an id";

    let t = {
      datas: obj
    };
    let test = json2xml.stringify(t, undefined, "myXml");
    test.should.eq(
      '<my-xml><datas id="an id"><data>text</data><data>other</data><data>3</data></datas></my-xml>'
    );
  });
  it("Should return a named object parsed with inner object and a converter test", () => {
    class MyData {
      constructor(id, name) {
        this.id = id;
        this.name = name;
        this.value1 = undefined;
        this.value2 = "";
        this.value3 = null;
      }
    }
    class MyNode {
      constructor(id, name) {
        this.id = id;
        this.name = name;
        this.data = new MyData("otherId", "othername");
        let self = this;
        Object.defineProperties(this, {
          _date: {
            value: new Date("2000-01-01T00:00:00.000Z"),
            enumerable: false
          },
          date: {
            get: () => self._date.getTime(), // get as long value
            enumerable: true
          }
        });
      }
    }

    let obj = new MyNode("anId", "aName");

    let test = json2xml.stringify(obj, { preserveEmptyOrNull: false });
    test.should.eq(
      '<my-node id="anId" name="aName" date="946684800000"><data id="otherId" name="othername"/></my-node>'
    );
  });
});
