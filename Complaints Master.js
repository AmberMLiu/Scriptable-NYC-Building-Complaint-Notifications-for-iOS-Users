// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: red; icon-glyph: mail-bulk;
// -------------------------------------- //
// -  SCRIPT CONFIG (CHANGE AS NEEDED)  - //
// -------------------------------------- //

// Comma-separated list of BINs, can be obtained from
// https://a810-bisweb.nyc.gov/bisweb/bispi00.jsp
// Example:
// const BUILDING_IDS = [
//      "1234567", "1234568", "1234569"
// ]

const BUILDING_IDS = [
    
]

// ---------- //
// -  CODE  - //
// ---------- //)

const output = BUILDING_IDS.toString()
Script.setShortcutOutput(BUILDING_IDS.toString())
Script.complete()