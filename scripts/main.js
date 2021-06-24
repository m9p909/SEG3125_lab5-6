// enable tooltips everywhere
var tooltipTriggerList = [].slice.call(
  document.querySelectorAll('[data-bs-toggle="tooltip"]')
);
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
  return new bootstrap.Tooltip(tooltipTriggerEl);
});

const debug = true;
//tabs enum
const TabsEnum = { payment: 1, contact: 2, services: 3, confirmation: 4 };
Object.freeze(TabsEnum);
// current state of input modal
let tab = TabsEnum.services;

const selectors = {
  picked: {
    services: "#servicespicked",
    doctor: "#doctorpicked",
    patient: "#patientpicked",
    date: "#datepicked",
    time: "#timepicked",
  },
	contact: {
		firstname: "#firstname",
		lastname: "#lastname"
	}
};

const servicesSelector = "#modalservices";
const paymentSelector = "#payment";
const contactSelector = "#contact";
const confirmSelector = "#confirm";

const nextButtonSelector = "#nextButton";
const previousButtonSelector = "#prevButton";

const ccSelector = "#cc";
const cvcSelector = "#cvc";
const phoneSelector = "#phone";
const dateSelector = "#date";

const invalidPhoneSelector = "#invalidphone";
const invalidCCSelector = "#invalidcc";
const invalidCVCSelector = "#invalidcvc";
const invalidDateSelector = "#invaliddate";
/*
          <p>Services Picked: <span id="servicespicked"></span></p>
          <p>With Doctor: <span id="doctorpicked"></span></p>
          <p>Patient: <span id="patientpicked"></span></p>
          <p>Date: <span id="datepicked"></span></p>
          <p>Time: <span id="datepicked"></span></p>
          */
const servicesConfirmSelector = "servicespicked";

$(document).ready(() => {
  $("[btn-type='doctorSelection']").on("click", onDoctorSelectionClick);
  $(nextButtonSelector).on("click", onNextClick);
  $(".close").on("click", onCloseClick);
  $(previousButtonSelector).on("click", onPrevClick);
  $(ccSelector).on("change", onCcChange);
  $(cvcSelector).on("change", onCVCChange);
  $(phoneSelector).on("change", onPhoneNumberChange);
  $(dateSelector).on("change", onDateChange);
  displayServices();
});

function onDoctorSelectionClick(handler) {
  var name = handler.target.name;
  if (debug) {
    console.log("you clicked " + name);
  }

  setSelectedDoctorTo(name);
}

function setSelectedDoctorTo(value) {
  var $radios = $("input:radio[name=dieticianSelection]");
  $radios.filter("#" + value).prop("checked", true);
}

function onNextClick() {
  if (tab == TabsEnum.services) {
    displayContact();
  } else if (tab == TabsEnum.contact) {
    displayPayment();
  } else if (tab == TabsEnum.payment) {
    displayConfirm();
  } else if (tab == TabsEnum.confirmation) {
    throw new Error("there is no next tab");
  }
  if (debug) {
    console.log("tab: " + tab);
  }
  setNextDisabled();
}

function onPrevClick() {
  if (tab == TabsEnum.services) {
    throw new Error("there is no previous tab");
  } else if (tab == TabsEnum.contact) {
    displayServices();
  } else if (tab == TabsEnum.payment) {
    displayContact();
  } else if (tab == TabsEnum.confirmation) {
    throw new Error("can't go back");
  }
  setNextDisabled();
  if (debug) {
    console.log("tab: " + tab);
  }
}

function displayServices() {
  tab = TabsEnum.services;
  $(servicesSelector).show();
  $(contactSelector).hide();
  $(paymentSelector).hide();
  $(confirmSelector).hide();
  $(nextButtonSelector).attr("data-bs-dismiss", "");
  $(nextButtonSelector).text("Next");
  $(nextButtonSelector).show("Next");
  $(previousButtonSelector).hide();
  tab = TabsEnum.services;
  setNextDisabled();
}

function displayContact() {
  tab = TabsEnum.contact;
  $(servicesSelector).hide();
  $(contactSelector).show();
  $(confirmSelector).hide();
  $(paymentSelector).hide();
  $(nextButtonSelector).attr("data-bs-dismiss", "");
  $(nextButtonSelector).text("Next");
  $(previousButtonSelector).show();
}

function displayPayment() {
  tab = TabsEnum.payment;
  $(servicesSelector).hide();
  $(contactSelector).hide();
  $(confirmSelector).hide();
  $(nextButtonSelector).attr("data-bs-dismiss", "");
  $(nextButtonSelector).show();
  $(nextButtonSelector).text("Book Appointment");
  $(paymentSelector).show();
  $(previousButtonSelector).show();
}

function displayConfirm() {
  tab = TabsEnum.payment;
  $(servicesSelector).hide();
  $(contactSelector).hide();
  $(paymentSelector).hide();
  $(confirmSelector).show();

  $(nextButtonSelector).attr("data-bs-dismiss", "modal");
  $(nextButtonSelector).text("");
  $(nextButtonSelector).hide();

  $(previousButtonSelector).hide();
}

function onCloseClick() {
  displayServices();
}

function setCurrentTab(id) {
  tab = id;
}

// form state
let phoneIsValid = false;
let dateIsValid = false;
let ccIsValid = false;
let cvcIsValid = false;
// from https://stackoverflow.com/questions/9315647/regex-credit-card-number-tests
const creditCardRegex =
  "^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35d{3})d{11})$";
// source of this function: https://stackoverflow.com/questions/175739/built-in-way-in-javascript-to-check-if-a-string-is-a-valid-number
// not my own work
function isNumeric(str) {
  if (typeof str != "string") return false; // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

function checkCreditCard(ccnumber) {
  const ccRegex = new RegExp(creditCardRegex);
  ccIsValid = isNumeric(ccnumber) && ccRegex.test(ccnumber);
  return ccIsValid;
}

function checkCVC(cvc) {
  cvcIsValid = cvc.length == 3 && isNumeric(cvc);
  return cvcIsValid;
}
//from https://stackoverflow.com/questions/16699007/regular-expression-to-match-standard-10-digit-phone-number
const phoneNumberRegex = "^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$";
function checkPhoneNumber(number) {
  const phoneRegExp = new RegExp(phoneNumberRegex);
  phoneIsValid = phoneRegExp.test(number);
  return phoneIsValid;
}

function checkDate(date) {
  console.log("date: " + date);

  dateIsValid = true;
  return dateIsValid;
}

// on form change functions

function genericOnChange(inputSelector, checkFunction, invalidSelector) {
  let currValue;
  if ($(inputSelector).attr("type") == "date") {
    currValue = new Date($(inputSelector).val());
  } else {
    currValue = $(inputSelector).val();
  }

  const boolean = checkFunction(currValue);
  if (boolean) {
    $(invalidSelector).hide();
  } else {
    $(invalidSelector).show();
  }
  setNextDisabled();
}

function setNextDisabled() {
  if (nextIsDisabled()) {
    $(nextButtonSelector).attr("disabled", "true");
  } else {
    $(nextButtonSelector).removeAttr("disabled");
  }
}

function nextIsDisabled() {
  const contactsValid = phoneIsValid && dateIsValid;
  if (tab == TabsEnum.contact) {
    return !contactsValid;
  }
  if (tab == TabsEnum.payment) {
    return !contactsValid || !ccIsValid || !cvcIsValid;
  } else {
    return false;
  }
}

function onPhoneNumberChange() {
  genericOnChange(
    phoneSelector,
    checkPhoneNumber,
    invalidPhoneSelector,
    phoneIsValid
  );
}

function onDateChange() {
  genericOnChange(dateSelector, checkDate, invalidDateSelector, dateIsValid);
}

function onCcChange() {
  genericOnChange(ccSelector, checkCreditCard, invalidCCSelector, ccIsValid);
}

function onCVCChange() {
  genericOnChange(cvcSelector, checkCVC, invalidCVCSelector, cvcIsValid);
}

// confirmation page
let confirm = {
  service,
  doctor,
  patient,
  date,
  time,
};

function setConfirm() {
	confirm.service = $(servicesSelector).val();
	confirm.doctor = $(doctorSelection).val();
	confirm.patient = $(selectors.contact.firstname).val() + " " + $(selectors.contact.lastname).val();
	confirm.date = new Date($(dateSelector).val());

}

