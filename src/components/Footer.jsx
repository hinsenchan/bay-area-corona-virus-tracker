import React from "react";
import Typography from "@material-ui/core/Typography";

/**
 * Presenter for application footer.
 */
function Footer() {
  return (
    <Typography align="center" variant="caption" component="h6">
      <p>
        <span>
          The time series data on this page is sourced from SF Chronicle's&nbsp;
        </span>
        <a href="https://projects.sfchronicle.com/2020/coronavirus-map/">
          Coronavirus Tracker
        </a>
        <span>
          . Original data compiled by the SF Chronicle was collected from
          the&nbsp;
          <a href="https://www.cdc.gov/coronavirus/2019-ncov/cases-in-us.html">
            Centers for Disese Control
          </a>
          ,&nbsp;
          <a href="https://www.cdph.ca.gov/Programs/CID/DCDC/Pages/Immunization/nCOV2019.aspx">
            California Department of Public Health
          </a>
          , and individual county public health departments.
        </span>
      </p>
      <p>
        <span>Created by Hinsen Chan</span>
        <br />
        <a
          href="https://github.com/hinsenchan"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://github.com/hinsenchan
        </a>
      </p>
    </Typography>
  );
}

export default Footer;
