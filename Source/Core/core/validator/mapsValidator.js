/**
 * MapsValidator namespace.
 * @constructor
 * @param {string} website
 */
class MapsValidator extends BasicValidator {
 constructor(website) {
   super(website, "maps");
   this.server = new Server();
   this.website = website;
 }
}
