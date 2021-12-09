---
id: faq
title: FAQ
---

A collection of frequently asked questions.

## Billing, Payments & Subscriptions

### What if I exceed the [config.json download](requests) limit of my plan?
Don't worry, we will keep serving your data and feature flags. Someone from our team will contact you to discuss your options.
You can always check your Usage & Quota [here](https://app.configcat.com/organization/usage).

### Where can I find and download my invoices?
All the invoices we issued are available for download from the [Billing & Invoices page.](https://app.configcat.com/organization/billing).
You need to have a [Billing Manager](organization#billing-manager-role) role to access the Billing & Invoices page.

### How do I upgrade / downgrade my billing plan?
You can change your billing plan on the [Plans](https://app.configcat.com/organization/plans) page.
You need to have a [Billing Manager](organization#billing-manager-role) role to access the Plans page.

### How do I change my payment method or billing information?
Go to the [Billing & Invoices page.](https://app.configcat.com/organization/billing) and click the `Update billing details` link.
You need to have a [Billing Manager](organization#billing-manager-role) role to access the Billing & Invoices page.

### How do I cancel my account?
Go to the [Plans](https://app.configcat.com/organization/plans) page and click the `Switch Plan` button under the Free plan.
You need to have a [Billing Manager](organization#billing-manager-role) role to access the Plans page.

### How do I change my currency?
Go to the [Plans](https://app.configcat.com/organization/plans) page and use the currency toggle to switch between USD and EUR.
You need to have a [Billing Manager](organization#billing-manager-role) role to access the Plans page.

## Security
### I can't login to ConfigCat, because I was asked a 2FA (Two-factor authentication) code that I don't know.

*Solution 1:* There might be an authenticator app on your phone that you can use to login to ConfigCat.

*Solution 2:* Contact your `Organization Admin`, and ask them to disable 2FA for your account until you set it up again.

*Solution 3:* Use your recovery codes that you received when you first set your 2FA up.

## A/B Testing & Targeting

### How do I use AND operators in my targeting rules?
Although there is no direct support for `AND` operators in the UI, you can use the `AND` operator as follows:

🤓 Via [De Morgan's laws](https://en.wikipedia.org/wiki/De_Morgan%27s_laws): `Condtion1 AND Condition2` is equivalent to `NOT (NOT Condition1 OR  NOT Condition2)`.

[Here is an example in our blog.](https://configcat.com/blog/2019/10/23/feature-flags-user-segmentation-and-targeting-examples/#everyone-in-my-company-plus-android-users-from-germany-above-v53)

### Are percentage rules sticky?
Yes. Once you set a percentage rule, it will be applied to the same users. So for example if you set a rule for 10% of your users, no matter how you change the percentage, the rule will be applied to the same users when you go back to 10%.

Also consider the following:
- All SDKs evaluate the rules in the exact same way. (10% is the same 10% in all SDKs)
- The percentage rules are sticky by feature flag. (10% is a different 10% for each feature flag)

### How to use targeting rules based on sensitive data?
If you want to use targeting rules based on email address, phone number, or other sensitive data, you can use the [Sensitve text comparators](https://configcat.com/docs/advanced/targeting/#sensitive-text-comparators).

### How can I be sure, that my data is safe?
The feature flag evaluation is done on the client side in the ConfigCat SDK. So if you are using the SDK, you can be sure that your data will never leave your system.

See our the architecture explained [here](https://configcat.com/architecture/).