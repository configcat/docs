/**
 * Copyright (c) 2017-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const React = require('react');

class Footer extends React.Component {
  docUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return `${baseUrl}docs/${language ? `${language}/` : ''}${doc}`;
  }

  pageUrl(doc, language) {
    const baseUrl = this.props.config.baseUrl;
    return baseUrl + (language ? `${language}/` : '') + doc;
  }

  render() {
    return (
      <footer className="nav-footer" id="footer">
        <section className="sitemap">
          <a href={this.props.config.baseUrl} className="nav-home">
            {this.props.config.footerIcon && (
              <img src={this.props.config.baseUrl + this.props.config.footerIcon} alt={this.props.config.title} width="66" height="58" />
            )}
          </a>
          <div>
            <h5>Engage</h5>
            <a href="https://twitter.com/configcat" target="_blank" rel="noreferrer noopener">Twitter</a>
            <a href="https://www.facebook.com/configcat" target="_blank">Facebook</a>
            <a href="https://www.linkedin.com/company/configcat/" target="_blank">LinkedIn</a>
          </div>
          <div>
            <h5>Know more</h5>
            <a href="https://configcat.com" target="_blank">ConfigCat.com</a>
            <a href="https://configcat.com/blog" target="_blank">Blog</a>
            <a href="https://github.com/configcat" target="_blank">GitHub repos</a>
          </div>
          <div>
            <h5>Need help?</h5>
            <a href="https://status.configcat.com" target="_blank">Service Status Monitor</a>
            <a href="https://join.slack.com/t/configcat-community/shared_invite/enQtMzkwNDg3MjQ3MTUyLWY1ZmE0NjY5NjA0YjAzMWU3MDg3ODhkMGI2ZjdmZjZmYTY4YTg1NmQ0YzBhMTVhOGE5YmNiYTI5OTg4NmNjYTQ" target="_blank">
              Join our Community Slack
            </a>
            <a href="https://configcat.com/support" target="_blank">Contact us</a>
          </div>
        </section>
        <section className="copyright">{this.props.config.copyright}</section>
      </footer>
    );
  }
}

module.exports = Footer;
