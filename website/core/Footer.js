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
              <img src={this.props.config.baseUrl + this.props.config.footerIcon} alt={this.props.config.title} width="66" height="58"/>
            )}
          </a>
          <div>
            <h5>Community</h5>
            <a href="https://join.slack.com/t/configcat-support/shared_invite/enQtMzkwNDg3MjQ3MTUyLTY0ZGQxOWEwZmI0ZGJlOWY3YmRmOTRlNjcyOTY1Y2EzNTFlYzg1NTY0ZDAzNzU0YjkxMWVmNzVmOTE5MWUzOTI" target="_blank" >Project Chat on Slack</a>
            <a href="https://twitter.com/configcat" target="_blank" rel="noreferrer noopener">Twitter</a>
                    <a href="https://www.facebook.com/configcat" target="_blank">Facebook</a>
                    <a href="https://www.linkedin.com/company/configcat/" target="_blank">LinkedIn</a>
          </div>
          <div>
            <h5>More</h5>
            <a href="https://github.com/configcat" target="_blank">GitHub</a>
          </div>
        </section>
        <section className="copyright">{this.props.config.copyright}</section>
      </footer>
    );
  }
}

module.exports = Footer;
