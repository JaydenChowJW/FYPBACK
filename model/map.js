require("dotenv").config();
const res = require("express/lib/response");
const { query } = require("../database");

const map = {
  addmarker: function (
    location_name,
    category,
    description,
    coordinates,
    image,
    callback
  ) {
    return query(
      `INSERT INTO marker (location_name, category, description, coordinates, image) VALUES ($1, $2, $3, $4,$5) RETURNING*`,
      [location_name, category, description, coordinates, image]
    ).then((result, err) => {
      if (err) {
        callback(err, null);
        console.log(err);
        return;
      } else {
        return callback(null, result);
      }
    });
  },

  getmarker: function (callback) {
    return query(
      `SELECT mapid, location_name, category, description, coordinates, image FROM marker`
    ).then((result, err) => {
      if (err) {
        callback(err, null);
        return;
      } else {
        return callback(null, result);
      }
    });
  },

  getmarkerindiv: function (mapid, callback) {
    return query(
      `SELECT mapid, location_name, category, description, coordinates, image FROM marker where mapid = $1 `,
      [mapid]
    ).then((result, err) => {
      if (err) {
        callback(err, null);
        return;
      } else {
        return callback(null, result);
      }
    });
  },

  updatemarker: function (
    mapid,
    location_name,
    category,
    description,
    image,
    callback
  ) {
    return query(
      "UPDATE marker SET location_name = $2, category = $3, description = $4 , image = $5 WHERE mapid = $1 RETURNING *",
      [mapid, location_name, category, description, image]
    )
      .then((result, err) => {
        if (err) {
          callback(err, null);
          console.log(err);
          return;
        } else {
          return callback(null, result);
        }
      })
      .catch((error) => {
        console.error("Error updating marker:", error);
        return callback(error, null);
      });
  },

  deletemarker: function (mapid, callback) {
    return query(
      `DELETE FROM marker
        WHERE mapid=$1`,
      [mapid]
    ).then((result, err) => {
      if (err) {
        callback(err, null);
        return;
      } else {
        return callback(null, result);
      }
    });
  },
};

module.exports = map;
