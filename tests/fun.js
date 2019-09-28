import mocha from "mocha";
import chai from "chai";
import * as json2xml from "../index";
const cshould = chai.should();

// @TODO add more real life tests please...
describe("Try to work with real-life stanzas", () => {
  it("Should parse a calendar iq", () => {
    let xml = `<iq id='my_cals001' type='result' to='alice@im.do.ne'>
  <identities xmlns='done:calendar:0'>
      <identity provider='google' name='alice.perso@gmail.com' userid='alice.perso@gmail.com' default='true' revoked='false' status='connected'>
          <calendar id='alice.perso@gmail.com' name='alice.perso@gmail.com' primary='true' writable='true' bgcolor='#C83B34'/>
      </identity>
      <identity provider='google' name='alice.busy@gmail.com' userid='alice.busy@gmail.com' default='false' revoked='true' status='disconnected'>
          <calendar id='id@group.calendar.google.com' name='TestAltCal' writable='false' bgcolor='#0C557C'/>
          <calendar id='alice.busy@gmail.com' name='alice.busy@gmail.com' primary='true' writable='true' bgcolor='#D999AE'/>
      </identity>
      <identity provider='microsoft' name='alice@do.ne' userid='db29d82b-6984-4aeb-bbf3-de4f98542ed3' default='false' revoked='false' status='connected'>
          <calendar id='id' name='Calendar' primary='true' writable='true' bgcolor='#CF813D'/>
      </identity>
  </identities>
</iq>`;

    const parser = new window.DOMParser();
    let obj = json2xml.parse(parser.parseFromString(xml, "text/xml"));
    obj.should.have.a.property("iq");
    obj.iq.should.have.a.property("identities");
    obj.iq.identities.should.have.a.property("length").eq(3);
  });
});
