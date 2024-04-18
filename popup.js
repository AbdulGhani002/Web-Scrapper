let numberOfEmails = 0;

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function displayEmails(emails) {
  const emailListDiv = document.getElementById("emailList");
  emailListDiv.innerHTML = "<h2>Email Addresses Found:</h2>";

  const validEmails = emails.filter(isValidEmail);

  if (validEmails && validEmails.length > 0) {
    validEmails.forEach((email) => {
      const emailElement = document.createElement("p");
      emailElement.innerHTML = `<a href="mailto:${email}" target="_blank">${email}</a>`;
      emailListDiv.appendChild(emailElement);
      numberOfEmails++;
    });
    console.log("Number of emails found:", numberOfEmails);
    alert("Number of emails found: " + numberOfEmails);
  } else {
    const noEmailsElement = document.createElement("p");
    noEmailsElement.textContent = "No valid email addresses found.";
    emailListDiv.appendChild(noEmailsElement);
  }
}

async function scrapeEmails() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const currentTabUrl = tab.url;

  async function scrapeEmailsFromPage(url) {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Failed to fetch page: ${url}`);
      }
      const html = await response.text();
      const text = html.replace(/<[^>]+>/g, " ");
      const emailsInHtml =
        text.match(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g) ||
        [];

      const scriptTags =
        html.match(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi) || [];
      const scriptContent = scriptTags.map((tag) =>
        tag.replace(/<[^>]+>/g, "")
      );
      const javascript = scriptContent.join(" ");
      const emailsInJS =
        javascript.match(
          /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
        ) || [];

      const allEmails = [...emailsInHtml, ...emailsInJS];
      return allEmails;
    } catch (error) {
      console.error("Error scraping emails from page", url, ":", error);
      return [];
    }
  }

  const emails = await scrapeEmailsFromPage(currentTabUrl);

  displayEmails(emails);
  chrome.action.setBadgeText({ text: numberOfEmails.toString() });
  chrome.action.setBadgeBackgroundColor({ color: "#FF0000" });
}

document.getElementById("scrapeButton").addEventListener("click", scrapeEmails);
