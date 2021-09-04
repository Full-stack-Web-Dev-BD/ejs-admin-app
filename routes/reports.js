var express = require("express");
var csv = require("csv-express");
var router = express.Router();
var subject = require("../models/subject");
var study = require("../models/study");
var site = require("../models/site");
var visit = require("../models/visit");
var phase = require("../models/phase");
var visitfields = require("../models/visitfield");
var visitcat = require("../models/visitcat");
var middleware = require("../middleware"); //index.js is a special name. So you don't have to explicitly mention the filename.
const form_status = require("../models/form_status");

router.get("/reports", middleware.isLoggedin, async function (req, res) {
  const formlist = await form_status.find();
  res.render("reports", { formlist });
});

router.get("/reports/visits", middleware.isLoggedin, async function (req, res) {
  const formlist = await form_status.find();
  res.render("reportvisits", { formlist });
});

router.get(
  "/reports/visits/allvisits",
  middleware.isLoggedin,
  async function (req, res) {
    const formlist = await form_status.find();
    visit
      .find({})
      .sort("Visit_date")
      .exec(function (err, visits) {
        if (err) {
          console.log(err);
          res.redirect("/reports/visits");
        } else {
          visitfields
            .find({})
            .sort("fieldorder")
            .exec(function (err, visitfields) {
              if (err) {
                console.log(err);
                res.redirect("/reports/visits");
              } else {
                visitcat
                  .find({})
                  .sort("visitcatorder")
                  .exec(function (err, visitcats) {
                    if (err) {
                      console.log(err);
                      res.redirect("/reports/visits");
                    } else {
                      res.render("reportvisitsallvisits", {
                        formlist,
                        visits: JSON.parse(JSON.stringify(visits)),
                        visitfields: visitfields,
                        visitcats: visitcats,
                      });
                      console.log(visits);
                    }
                  });
              }
            });
        }
      });
  }
);

router.get(
  "/reports/visits/allvisits/exportcsv",
  middleware.isLoggedin,
  async function (req, res) {
    var filename = "visits.csv";
    var dataArray;
    const formlist = await form_status.find();

    visit
      .find({})
      .sort("Visit_date")
      .exec(function (err, visits) {
        if (err) {
          console.log(err);
        } else {
          res.setHeader("Content-Type", "text/csv");
          res.setHeader(
            "Content-Disposition",
            "attachment; filename=" + filename
          );
          res.csv(JSON.parse(JSON.stringify(visits)), true);
        }
      });
  }
);

router.get(
  "/reports/visits/allvisitsdetailed",
  middleware.isLoggedin,
  async function (req, res) {
    const formlist = await form_status.find();

    visit
      .find({})
      .populate("Study")
      .populate("Site")
      .populate("Phase")
      .populate("Subject")
      .sort("Visit_date")
      .exec(function (err, returnedvisits) {
        if (err) {
          console.log(err);
          res.redirect("/reports/visits");
        } else {
          visitfields
            .find({})
            .sort("fieldorder")
            .exec(function (err, visitfields) {
              if (err) {
                console.log(err);
                res.redirect("/reports/visits");
              } else {
                console.log(returnedvisits);
                res.render("reportvisitsallvisitsDet", {
                  formlist,
                  visits: JSON.parse(JSON.stringify(returnedvisits)),
                  visitfields: visitfields,
                });
              }
            });
        }
      });
  }
);

module.exports = router;
