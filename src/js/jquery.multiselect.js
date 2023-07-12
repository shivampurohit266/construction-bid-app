import $ from "jquery";

$.fn.multiSelect = function (options) {
  // Default options
  var settings = $.extend(
    {
      label: "Select",
    },
    options
  );

  var wrap = this,
    selectEl = wrap.children("select"),
    inputEl = wrap.children("input");

  var mainEl = $("<div></div>").addClass("multiselect-wrap"),
    selectedEl = $("<div></div>")
      .addClass("multiselect-selected")
      .text(settings.label),
    listEl = $("<div></div>")
      .addClass("multiselect-list")
      .css("display", "none");

  selectEl.find("option").each(function () {
    var option = $(this);
    var optionEl = $("<div></div>")
      .text(option.text())
      .attr("data-val", option.val());
    optionEl.appendTo(listEl);

    optionEl.on("click", function () {
      $(this).toggleClass("selected-option");
      selectedEl.empty();
      let selectedVal = [];
      let currentElem = null;
      listEl.find(".selected-option").each(function () {
        var $this = $(this),
          span = $("<span></span>").text($this.text());

        span.appendTo(selectedEl);

        if ($this.text() === "Custom") {
          $("#custom-message1").slideDown();
        } else if ($this.text() === "Custom 1") {
          $("#custom-message2").slideDown();
        } else {
          $("#custom-message1").hide();
          $("#custom-message2").hide();
        }
        currentElem = $this.attr("data-val");
        selectedVal.push($this.attr("data-val"));
      });

      if (inputEl.length > 0) {
        inputEl.val(selectedVal.join(","));

        if (wrap.attr("id") === "legal-agreement") {
          if (selectedVal[0] === "Timber") {
            
            var elementExists = document.getElementById("klon-tim");

            if (elementExists === null) {
              // get the last DIV which ID starts with ^= "klon"
              var $div = $('div[id^="klon"]:last');

              // Check if a value exists in the fruits array
              // Clone it and assign the new ID (i.e: from num 4 to ID "klon4")
              var $klon = $div.clone().prop("id", "klon-tim");
              

              // Finally insert $klon wherever you want
             
              $div.after('<div class="form-check form-check-inline" id="klon-tim"><input class="form-check-input" id="" type="checkbox"><label class="form-check-label" for="agreement-issues"><div class="mb-2"><a href="https://www.w3schools.com/jquery/jquery_dom_add.asp">Timber legal issues</a></div><div></div><br></label></div>');
            }
          } else if (selectedVal[0] !== "Timber") {
            $('div[id="klon-tim"]').remove();
          }
          if (
            selectedVal[0] === "Electricity" ||
            selectedVal[1] === "Electricity"
          ) {
            var elementExists1 = document.getElementById("klon-elec");

            if (elementExists1 === null) {
              // get the last DIV which ID starts with ^= "klon"
              var $div1 = $('div[id^="klon"]:last');

              // Check if a value exists in the fruits array
              // Clone it and assign the new ID (i.e: from num 4 to ID "klon4")
              var $klon1 = $div1.clone().prop("id", "klon-elec");

              // Finally insert $klon wherever you want
              // $div1.after($klon1);
              $div1.after('<div class="form-check form-check-inline" id="klon-elec"><input class="form-check-input" id="" type="checkbox"><label class="form-check-label" for="agreement-issues"><div class="mb-2"><a href="https://www.w3schools.com/jquery/jquery_dom_add.asp">Electricity legal issues</a></div><div></div><br></label></div>');
            }
          } else if (
            selectedVal[0] !== "Electricity" ||
            selectedVal[1] !== "Electricity"
          ) {
            $('div[id="klon-elec"]').remove();
          }
          if (
            selectedVal[0] === "Plumbing" ||
            selectedVal[1] === "Plumbing" ||
            selectedVal[2] === "Plumbing"
          ) {
            var elementExists2 = document.getElementById("klon-plum");

            if (elementExists2 === null) {
              // get the last DIV which ID starts with ^= "klon"
              var $div2 = $('div[id^="klon"]:last');

              // Check if a value exists in the fruits array
              // Clone it and assign the new ID (i.e: from num 4 to ID "klon4")
              var $klon2 = $div2.clone().prop("id", "klon-plum");

              // Finally insert $klon wherever you want
              // $div2.after($klon2);
              $div2.after('<div class="form-check form-check-inline" id="klon-plum"><input class="form-check-input" id="" type="checkbox"><label class="form-check-label" for="agreement-issues"><div class="mb-2"><a href="https://www.w3schools.com/jquery/jquery_dom_add.asp"> Plumbing legal issues</a></div><div></div><br></label></div>');
            }
          } else if (
            selectedVal[0] !== "Plumbing" ||
            selectedVal[1] !== "Plumbing" ||
            selectedVal[2] !== "Plumbing"
          ) {
            $('div[id="klon-plum"]').remove();
          }
        }
      }
    });
  });

  selectedEl.on("click", function () {
    if (listEl.hasClass("multi-list-opened")) {
      listEl.slideUp(function () {
        listEl.removeClass("multi-list-opened");
      });
    } else {
      listEl.slideDown(function () {
        listEl.addClass("multi-list-opened");
      });
    }
  });
  mainEl.append(selectedEl).append(listEl);
  wrap.append(mainEl);
  selectEl.hide();

  $("html").click(function (e) {
    if (
      !$(e.target).is(wrap) &&
      !$(e.target).is(listEl) &&
      !$(e.target).is(selectedEl) &&
      !$(e.target).is(mainEl) &&
      !$(e.target).is(listEl.children()) &&
      !$(e.target).is(selectedEl.children())
    ) {
      if (listEl.hasClass("multi-list-opened")) {
        //console.log("html event");
        listEl.slideUp(function () {
          listEl.removeClass("multi-list-opened");
        });
      }
    }
  });
  return this;
};
