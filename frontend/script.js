
document.addEventListener("DOMContentLoaded", function () {
  var today = new Date().toLocaleDateString("en-US", { weekday: "long" });
  var rows = document.querySelectorAll(".sched tbody tr");
  rows.forEach(function (row) {
    if (row.cells[0].textContent.trim() === today) {
      row.classList.add("today");
      row.cells[0].innerHTML = today + " <small>(today)</small>";
    }
  });
});