# Privacy Policy

**Your NewTab** — Chrome Extension
Last updated: March 1, 2026

---

## Overview

Your NewTab is a Chrome new tab extension that displays a random quote. We are committed to protecting your privacy. This policy explains what data is collected and how it is used.

## Data We Collect

**We do not collect any personal data.**

The extension does not transmit, store, or share any information about you or your browsing activity to any server we control.

## Local Storage

The extension stores the following preferences **locally on your device** using `chrome.storage.local`:

- Background color
- Font size
- Font family
- Quote category

This data never leaves your device and is only used to restore your settings between sessions.

## Network Requests

The extension makes a single read-only request to fetch a curated list of quotes from a publicly accessible GitHub Gist:

```text
https://gist.githubusercontent.com/fuongz/dc7bdaffc9181e7ef0b176f1f025ab22/
```

- No user data is included in this request
- No cookies or identifiers are sent
- The request is made by your browser directly to GitHub's servers

Please refer to [GitHub's Privacy Policy](https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement) for how GitHub handles these requests.

## Third-Party Services

The extension does not use any analytics, advertising, or tracking services.

## Changes to This Policy

If this policy changes, the updated version will be published in the extension's repository.

## Contact

For questions, open an issue at the [GitHub repository](https://github.com/fuongz/your-newtab).
