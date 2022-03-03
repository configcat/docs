---
id: faq
title: FAQ
---

export const FaqSchema = require('@site/src/schema-markup/faq.json');

<script type='application/ld+json' dangerouslySetInnerHTML={ { __html: JSON.stringify(FaqSchema) }}></script>

A collection of frequently asked questions.

## Billing, Payments & Subscriptions

### What if I exceed the [config.json download](requests) limit of my plan?
Don't worry, we will keep serving your data and feature flags. Someone from our team will contact you to discuss your options.
You can always check your Usage & Quota [here](https://app.configcat.com/organization/usage).

### Where can I find and download my invoices?
All the invoices we issued are available for download from the [Billing & Invoices page.](https://app.configcat.com/organization/billing).
You need to have a [Billing Manager](organization.md/#billing-manager-role) role to access the Billing & Invoices page.

### How do I upgrade / downgrade my billing plan?
You can change your billing plan on the [Plans](https://app.configcat.com/organization/plans) page.
You need to have a [Billing Manager](organization.md/#billing-manager-role) role to access the Plans page.

### How do I change my payment method or billing information?
Go to the [Billing & Invoices page.](https://app.configcat.com/organization/billing) and click the `Update billing details` link.
You need to have a [Billing Manager](organization.md/#billing-manager-role) role to access the Billing & Invoices page.

### How do I cancel my account?
Go to the [Plans](https://app.configcat.com/organization/plans) page and click the `Switch Plan` button under the Free plan.
You need to have a [Billing Manager](organization.md/#billing-manager-role) role to access the Plans page.

### How do I change my currency?
Go to the [Plans](https://app.configcat.com/organization/plans) page and use the currency toggle to switch between USD and EUR.
You need to have a [Billing Manager](organization.md#billing-manager-role) role to access the Plans page.

## Security
### I can't login to ConfigCat, because I was asked a 2FA (Two-factor authentication) code that I don't know.

*Solution 1:* There might be an authenticator app on your phone that you can use to login to ConfigCat.

*Solution 2:* Contact your `Organization Admin`, and ask them to disable 2FA for your account until you set it up again.

*Solution 3:* Use your recovery codes that you received when you first set your 2FA up.

## A/B Testing & Targeting

### Can I use AND operators in my targeting rules?
Although there is no direct support for `AND` operators in the UI, you can use the `AND` operator with a combination of `OR` and `NOT` operators.

#### OR Example
Turn a feature `ON` if a user is in `Germany` `OR` logged in with an account from `@mycompany.com`.

```
IF Country IS ONE OF Germany THEN feature is ON
ELSE IF Email CONTAINS @mycompany.com THEN feature is ON
To all other users the feature is OFF
```
![OR example](/assets/faq/or-example.png)

#### AND Example
Turn a feature `ON` if a user is in `Germany` `AND` logged in with an account from `@mycompany.com`.
```
IF Country IS NOT ONE OF Germany THEN feature is OFF
ELSE IF Email DOES NOT CONTAIN @mycompany.com THEN feature is OFF
To all other users the feature is ON
```
![AND example](/assets/faq/and-example.png)

[Here is an example in our blog.](https://configcat.com/blog/2019/10/23/feature-flags-user-segmentation-and-targeting-examples/#everyone-in-my-company-plus-android-users-from-germany-above-v53)

### Are percentage options sticky?
Yes. The percentage-based targeting is sticky by design and consistent across all SDKs.

Also, consider the following:
- All SDKs evaluate the rules in the exact same way. (10% is the same 10% in all SDKs)
- The percentage rules are sticky by feature flag. (10% is a different 10% for each feature flag)

[More on stickiness and consistency](advanced/targeting.md/#stickiness--consistency)

### How to use targeting rules based on sensitive data?
If you want to use targeting rules based on email address, phone number, or other sensitive data, you can use the [Sensitive text comparators](https://configcat.com/docs/advanced/targeting/#sensitive-text-comparators).

### How can I be sure, that my data is safe?
The feature flag evaluation is done on the client-side in the ConfigCat SDK. So if you are using the SDK, you can be sure that your data will never leave your system.

See our the architecture explained [here](https://configcat.com/architecture/).

## Technical Debt
### What are Zombie Flags?
Zombie flags (or stale flags) are feature flags that are not changed in the last (configurable) number of days. Most of the time if a feature flag isn't changed for a long time it means it is time to be removed from your source code and from the [ConfigCat Dashboard](https://app.configcat.com/) as well to avoid technical debt.

### What is the Zombie Flags Report?
The [Zombie Flags Report](https://app.configcat.com/my-account/zombie-flags-report) is a list of all feature flags that are not changed in the last (configurable) number of days. You can use this report to identify and remove stale feature flags from your source code. This report is weekly emailed to you. You can set your [email preferences here](https://app.configcat.com/my-account/zombie-flags-report).

### How to avoid technical debt caused by feature flags?
The [ConfigCat CLI](advanced/code-references/overview) can scan your code, upload code references to the [ConfigCat Dashboard](https://app.configcat.com/) and notify you about stale feature flags.
![Code references screenshot](/assets/cli/code-refs.png)
