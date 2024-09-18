"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
// Path to the old 'dist' folder
var oldDistPath = '\\\\10.100.77.240\\deploy_web_dev\\HQ\\TRR-MES\\web\\dist';
// Get current datetime in the format 'YYYYMMDDHHMMSS'
var timestamp = new Date().toISOString().replace(/[-T:.Z]/g, '').slice(0, 14);
// Define the new path with the datetime appended
var newDistPath = (0, path_1.join)('\\\\10.100.77.240\\deploy_web_dev\\HQ\\TRR-MES\\web', "dist_".concat(timestamp));
// Check if the old 'dist' folder exists before renaming
if ((0, fs_1.existsSync)(oldDistPath)) {
    try {
        (0, fs_1.renameSync)(oldDistPath, newDistPath);
        console.log("Successfully renamed 'dist' to 'dist_".concat(timestamp, "'"));
    }
    catch (err) {
        console.error('Error renaming dist folder:', err);
    }
}
else {
    console.log('No existing dist folder found.');
}
