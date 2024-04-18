function scrapeEmails() {
  let text = document.body.innerText;
  let emails = text.match(
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
  );
  displayEmails(emails);
}

function displayEmails(emails) {
  let emailListDiv = document.getElementById("emailList");
  emailListDiv.innerHTML = "<h2>Email Addresses Found:</h2>";

  if (emails) {
    emails.forEach(function (email) {
      let emailElement = document.createElement("p");
      emailElement.textContent = email;
      emailListDiv.appendChild(emailElement);
    });
  } else {
    let noEmailsElement = document.createElement("p");
    noEmailsElement.textContent = "No email addresses found.";
    emailListDiv.appendChild(noEmailsElement);
  }
}
