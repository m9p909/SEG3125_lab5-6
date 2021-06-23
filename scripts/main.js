const debug = true;
// current state of input modal
let tab = "Contact";
$(document).ready(() => {
  var doctorSelectButton = $("[btn-type='doctorSelection']").on(
    "click",
    onDoctorSelectionClick
  );
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
  if (tab == "Services") {
    tab = "Contact";
  } else if (tab == "Contact") {
    tab = "Payment";
    $("#nextButton").text("Book Appointment");
  } else if (tab == "Payment") {
    tab = "Services";
    $("#nextButton").text("Schedule Appointment");
  }
}

function setNextButtonToPaymentState() {
  $("#nextButton").text("Book Appointment");
  $("#nextButton").attr("data-bs-dismiss", "modal");
}

function setCurrentTab(id) {
  tab = id;
}
