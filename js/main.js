document.addEventListener("DOMContentLoaded", function (event) {

  //-----load page info
  function loadPageInfo() {
    $('[data-toggle="tooltip"]').tooltip();

    $("#custom_schedule_div").hide();
    $("#shift_supervisor_div").hide('slow');
    $("#shift_operator_div").hide('slow');
    $("#supervisor_infos").hide();
    $("#operator_infos").hide();

    fetchShift();
    fetchShiftType();
    
    $('#shift').select2({placeholder: "Select shift", allowClear: true});
    $('#schedule').select2();
    $('#number_of_floater').select2();

    $("#loading_div").fadeOut('slow');
    
    if(sessionStorage.getItem('supervisorInfo') && sessionStorage.getItem('operatorInfo')) {
      return;
    }
   
    fetchEmployee();
  };

  loadPageInfo();
});
  

//-----choose shift
$('#shift').bind('change', function(e) {

  $("#loading_div").fadeIn();
  
  $("#custom_schedule_div").hide('slow');
  $("#shift_supervisor_div").hide('slow');
  $("#shift_operator_div").hide('slow');
  $("#supervisor_infos").hide('slow');
  $("#operator_infos").hide('slow');

  let scheduleById = document.querySelector("#schedule");
  scheduleById.innerHTML = '';
  let selectedShift = e.target.value;
  
  if(!selectedShift) {
    document.querySelector("#shift_supervisor").innerHTML = '';
    document.querySelector("#supervisor_infos").innerHTML = '';
    document.querySelector("#shift_operator").innerHTML = '';
    document.querySelector("#operator_infos").innerHTML = '';
    
    document.querySelector("#submit_btn").disabled = true;
    $("#loading_div").fadeOut('slow');
    return;
  }
  
  fetchShiftScheduleByShift(scheduleById, selectedShift);

  // check shift [D & E]
  let getSupInfos = JSON.parse(sessionStorage.getItem('supervisorInfo'));
  let getOpInfos = JSON.parse(sessionStorage.getItem('operatorInfo'));

  let sup_info = document.getElementById('supervisor_infos');
  let op_info = document.getElementById('operator_infos');
  sup_info.innerHTML = '';
  op_info.innerHTML = '';

  $("#shift_supervisor").html("<option></option>");
  $("#shift_operator").empty();

  let selectedIndex = e.target.selectedIndex;
  if(["D", "E"].includes(e.target.options[selectedIndex].text.toUpperCase())) {
    let getShiftInfo = JSON.parse(sessionStorage.getItem('shiftInfo'))[selectedIndex-1];
    
    for(let i=0; i<getSupInfos.length; i++) {

      if(getSupInfos[i].shift_id == selectedShift) {
        let shift_supervisor_option = document.createElement("option");
        shift_supervisor_option.value = getSupInfos[i].id;
        shift_supervisor_option.text = `(${getSupInfos[i].shift_name}-${getSupInfos[i].employee_id}) ${getSupInfos[i].name}`;
        $("#shift_supervisor").append(shift_supervisor_option);
      }
    }

    $('#shift_supervisor').select2({placeholder: "Select shift supervisor"});
    $("#shift_supervisor").next("span").css({"width": "100%"})

    for(let i=0; i<getOpInfos.length; i++) {

      if(getOpInfos[i].shift_id != 'recShEgyVJWF4Mcmj') { // not allow shift A and Asst. supervisor users
        if(!getOpInfos[i]["user_type_id"].includes("recEQnAKZzYYPKflc")) {
          let shift_operator_option = document.createElement("option");
          shift_operator_option.value = getOpInfos[i].id;
          shift_operator_option.text = `(${getOpInfos[i].shift_name}-${getOpInfos[i].employee_id}) ${getOpInfos[i].name}`;
          $("#shift_operator").append(shift_operator_option);
        }
      }
    }

    let max_operators = getShiftInfo['max_team_size']-1; // 1 shift supervisor
    $('#shift_operator').select2({placeholder: "Select shift operators", maximumSelectionLength: max_operators, allowClear: true});
    $("#shift_operator").next("span").css({"width": "100%"})

    $("#loading_div").fadeOut('slow');

    $("#shift_supervisor_div").show('slow');
    $("#shift_operator_div").show('slow');

    $("#shift_operator_tooltip").attr("data-bs-original-title", `You have to select ${max_operators} operators`);

    document.querySelector("#submit_btn").disabled = false;
    return;
  }

  let sup_content = createContent("supervisor", getSupInfos, 0, "DOM-READY", {"selectedShift": selectedShift});
  sup_info.innerHTML = sup_content.html;

  $("#supervisor_infos").show('slow');

  $('.supervisor_list').select2({placeholder: "Select supervisor here", allowClear: true});

  let op_content = createContent("operator", getOpInfos, 0, "DOM-READY", {"selectedShift": selectedShift});
  op_info.innerHTML = op_content.html;

  $("#operator_infos").show('slow');

  $('.operator_list').select2({placeholder: "Select operator here", maximumSelectionLength: 2, allowClear: true});

  $("#loading_div").fadeOut('slow');

  if(sup_content.find && op_content.find) {
    document.querySelector("#submit_btn").disabled = false;
  }
});


//-----choose schedule
$('#schedule').bind('change', function(e) {
  if(e.target.value!='custom') {
    $("#custom_schedule_div").hide("slow");
    return;
  }

  $("#loading_div").fadeIn('slow');

  document.querySelector("#custom_schedule").innerHTML = "";
  let info = JSON.parse(sessionStorage.getItem("shiftTypeInfo"));

  for(let i=0; i<info.length; i++) {
    var option = document.createElement("option");
    option.value = info[i].id;
    option.text = `[${info[i]['name']}]__${info[i]['duration']}`;
    document.querySelector("#custom_schedule").appendChild(option);

    option.setAttribute('start-time', info[i]["start_time"]);
    option.setAttribute('end-time', info[i]["end_time"]);
    option.setAttribute('duration', info[i]["duration"]);
  }

  $("#custom_schedule_div").show('slow');
  $("#loading_div").fadeOut('slow');
});


//-----select shift [D & E] supervisor
function selectShiftSupervisor() {
  $("#supervisor_infos").hide('slow');

  let selected_option = $("#shift_supervisor option:selected").text().split(")");
  let info = [{
    "id": $("#shift_supervisor").val(),
    "name": selected_option[1],
    "employee_id": selected_option[0].split("-")[1]
  }];

  let sup_content = createContent("supervisor", info, 0, "SHIFT-D-E", {});
  document.getElementById('supervisor_infos').innerHTML = sup_content.html;

  $("#supervisor_infos").show('slow');
  $('.supervisor_list').select2({placeholder: "Select supervisor", allowClear: true});
}


//-----select shift [D & E] operators
function selectShiftOperators(e) {
  $("#operator_infos").hide('slow');

  let selected_operators = $("#shift_operator").val();
  let getOpInfos = JSON.parse(sessionStorage.getItem("operatorInfo"));
  
  let op_info = document.getElementById('operator_infos');
  op_info.innerHTML = '';

  let op_content = createContent("operator", getOpInfos, 0, "SHIFT-D-E", {});
  document.getElementById('operator_infos').innerHTML = op_content.html;
  
  $("#operator_infos").show('slow');
  $('.operator_list').select2({placeholder: "Select supervisor", allowClear: true});
}


//-----return shift start time
function shiftStartTime() {
  if(document.querySelector("#schedule").value == 'custom') {
    return document.querySelector("#custom_schedule").options[document.querySelector("#custom_schedule").selectedIndex].getAttribute("start-time");
  }
  return document.querySelector("#schedule").options[document.querySelector("#schedule").selectedIndex].getAttribute("start-time");
}


//-----return shift end time
function shiftEndTime() {
  if(document.querySelector("#schedule").value == 'custom') {
    return document.querySelector("#custom_schedule").options[document.querySelector("#custom_schedule").selectedIndex].getAttribute("end-time");
  }
  return document.querySelector("#schedule").options[document.querySelector("#schedule").selectedIndex].getAttribute("end-time");
}


//-----return shift duration
function shiftDuration() {
  if(document.querySelector("#schedule").value == 'custom') {
    return document.querySelector("#custom_schedule").options[document.querySelector("#custom_schedule").selectedIndex].getAttribute("duration");
  }
  return Number(document.querySelector("#schedule").options[document.querySelector("#schedule").selectedIndex].getAttribute("duration"));
}


//-----proxy operation
function proxyOperation(designation, id, sl) {
  let getInfo = sessionStorage.getItem(`${designation}Info`);
  if(!getInfo) {
    alert('Not loaded data properly! Reload page again.');
    document.querySelector(`#${designation}_${id}`).checked = !event.target.checked;
    return;
  } 

  let count = document.querySelector(`#${designation}_proxy_details_${id}`).childElementCount-1;

  let shift_start_time = shiftStartTime();
  let shift_duration = shiftDuration();
  
  if (event.target.checked) {
    $(`#${designation}_proxy_${id}`).css("background-color", "#eaffef");
    $(`#${designation}_proxy_details_${id}`).css("background-color", "rgb(207 245 209 / 50%)");

    for(let i=0; i<=count; i++) {
      document.querySelector(`#${designation}_duty_type_${i}_${id}`).disabled = false;
      document.querySelector(`#${designation}_list_${i}_${id}`).disabled = false;
      document.querySelector(`#${designation}_start_time_${i}_${id}`).disabled = false;
      document.querySelector(`#${designation}_duration_${i}_${id}`).disabled = false;
      
      timePickerFullHour(shift_start_time, shift_duration, `#${designation}_start_time_${i}_${id}`);
      document.querySelector(`#${designation}_duration_${i}_${id}`).value = shift_duration;

      if(i>0) {
        document.querySelector(`#${designation}_remove_${i}_${id}`).disabled = false;
      }
    }

    document.querySelector(`#${designation}_add_${id}`).disabled = false;

    // check employee list is already loaded or not
    if(document.querySelector(`#${designation}_list_${count}_${id}`).length <= 1) {
      let info = JSON.parse(getInfo);
      for(let i=0; i<info.length; i++) {
        let option = document.createElement("option");
        option.value = info[i].id;
        option.text = `(${info[i].shift_name}-${info[i].employee_id}) ${info[i].name}`;
        document.querySelector(`#${designation}_list_${count}_${id}`).appendChild(option);
      }
    }

  } else {
    $(`#${designation}_proxy_${id}`).css("background-color", "");
    $(`#${designation}_proxy_details_${id}`).css("background-color", "");

    document.querySelector(`#${designation}_duty_type_0_${id}`).disabled = true;
    document.querySelector(`#${designation}_list_0_${id}`).disabled = true;
    document.querySelector(`#${designation}_start_time_0_${id}`).disabled = true;
    document.querySelector(`#${designation}_duration_0_${id}`).disabled = true;

    document.querySelector(`#${designation}_list_0_${id}`).value = "";
    document.querySelector(`#${designation}_start_time_0_${id}`).innerHTML = "";
    document.querySelector(`#${designation}_duration_0_${id}`).value = "";

    for(let i=1; i<=count; i++) {
      document.querySelector(`#${designation}_proxy_div_${i}_${id}`).remove();
    }
    document.querySelector(`#${designation}_add_${id}`).disabled = true;
  }
}


//-----add more row
function add(designation, id, sl) {
  let getInfo = sessionStorage.getItem(`${designation}Info`);
  if(!getInfo) {
    alert('Not loaded data! Reload page again.');
    return;
  }

  let proxy_details = document.querySelector(`#${designation}_proxy_details_${id}`);
  let count = proxy_details.children.length;

  // calculate remaining shift duration and next start time
  let calc_result = remainingShiftDurationAndNextStartTime(designation, id, (count-1));
  let shift_end_time = shiftEndTime();

  if(!calc_result['allowed']) {
    Toast.fire({
      icon: 'error',
      title: `Shift duration exceed!`
    })
    return;
  }

  let div = document.createElement('div');
  div.setAttribute("class", "row pt-1 pb-1");
  div.setAttribute("id", `${designation}_proxy_div_${count}_${id}`);
  let content = createContent(designation, getInfo, count, "ADD", {"id": id, "new_duration": calc_result["new_duration"]});
  div.innerHTML = content.html;
  proxy_details.appendChild(div);

  timePickerFullHour(calc_result["new_start_time"], calc_result["new_duration"], `#${designation}_start_time_${count}_${id}`);

  $(`.${designation}_list`).select2({
    placeholder: `Select ${designation}`,
    allowClear: true
  });
}


//-----remove row
function remove(op, remove_prox_div) {
  document.querySelector(`#${remove_prox_div}`).remove();
}


//-----prevent submit on pressing enter
document.getElementById('operation_form').addEventListener('keypress', function(e) {
  if (e.keyCode === 13) {
    e.preventDefault();
  }
});


//-----custom validation
function customValidation(error=true, id, message) {
  if(error) {
    document.querySelector(`#${id}`).style.border = `2px solid red`;
    document.querySelector(`#error_${id}`).innerHTML = `<span style="color: red;">${message}</span>`;
  } else {
    document.querySelector(`#${id}`).style.border = `2px solid green`;
    document.querySelector(`#error_${id}`).innerHTML = "";
  }
}


//-----submit form
document.querySelector("#submit_btn").addEventListener("click", (e) => {
  e.preventDefault();

  let data=[], error_count=0;
  let total_proxy=0, total_sup_proxy=0, total_op_proxy=0;
  let total_swap=0, total_sup_swap=0, total_op_swap=0;

  if(["D", "E"].includes($("#shift option:selected").text())) {

    //---------- validation start ----------
    // supervisor
    if(!document.querySelector("#shift_supervisor").value) {
      customValidation(true, `shift_supervisor`, error_message["required"]);
      error_count++;
    } else {
      customValidation(false, `shift_supervisor`, "");
    }

    // operator
    let op_len = JSON.parse(sessionStorage.getItem('shiftInfo'))[$("#shift").prop('selectedIndex')-1]['max_team_size']-1;
    let selected_op_len = $("#shift_operator").val().length;
    
    if(!document.querySelector("#shift_operator").value) {
      customValidation(true, `shift_operator`, error_message["required"]);
      error_count++;    
    } else if(selected_op_len != op_len) {
      customValidation(true, "shift_operator", `${op_len-selected_op_len} ${error_message["option_remain"]}`);
      error_count++;
    } else {
      customValidation(false, `shift_operator`, "");
    }
    //---------- validation end ----------
  }

  let shift_duration = shiftDuration();
  let shift_start_time = shiftStartTime();

  // supervisor collections
  let shift_supervisor_ids=[], sup_start_time_info=[]; sup_duration_info=[]; sup_proxy_details=[], sup_proxy_index=[], sup_index=0;
  document.querySelector("#supervisor_infos").childNodes.forEach(function(tr) {
    let duty_start_time = shift_start_time;
    let duty_start_hour = Number(duty_start_time.split(":")[0]);
    let duty_duration = shift_duration;
    let sup_id = tr.id.split("_")[3];

      if(document.querySelector(`#supervisor_${sup_id}`).checked) {
        let details = [], calc_start_time="", sum=0, proxy_count=0, swap_count=0;
        let proxy_length = document.querySelector(`#supervisor_proxy_details_${sup_id}`).children.length;

        for(let i=0; i<proxy_length; i++) {
          let proxy_id = document.querySelector(`#supervisor_list_${i}_${sup_id}`).value;

          //---------- validation start ----------
          // supervisor list
          if(!document.querySelector(`#supervisor_list_${i}_${sup_id}`).value) {
            customValidation(true, `supervisor_list_${i}_${sup_id}`, error_message["required"]);
            error_count++;
          } else if(data.includes(proxy_id)) {
            customValidation(true, `supervisor_list_${i}_${sup_id}`, error_message["duplicate"]);
            error_count++;
          } else {
            customValidation(false, `supervisor_list_${i}_${sup_id}`, "");
          }

          // start time
          if(!document.querySelector(`#supervisor_start_time_${i}_${sup_id}`).value) {
            customValidation(true, `supervisor_start_time_${i}_${sup_id}`, error_message["required"]);
            error_count++;
          } else {
            customValidation(false, `supervisor_start_time_${i}_${sup_id}`, "");
          }

          // duration
          sum += Number(document.querySelector(`#supervisor_duration_${i}_${sup_id}`).value);
          if(!document.querySelector(`#supervisor_duration_${i}_${sup_id}`).value || Number(document.querySelector(`#supervisor_duration_${i}_${sup_id}`).value)<1) {
            customValidation(true, `supervisor_duration_${i}_${sup_id}`, error_message["required"]);
            error_count++;
          } else if(sum>shift_duration){
            customValidation(true, `supervisor_duration_${i}_${sup_id}`, `${error_message["exceed"]} ${shift_duration}`);
            error_count++;
          } else {
            customValidation(false, `supervisor_duration_${i}_${sup_id}`, "");
          }
          //---------- validation end ----------

          // identify duty start time
          let recent_srart_hour = Number(document.querySelector(`#supervisor_start_time_${i}_${sup_id}`).value.split(":")[0]);
          let recent_duration = Number(document.querySelector(`#supervisor_duration_${i}_${sup_id}`).value);
          let calc_recent_end_hour = recent_srart_hour + recent_duration;
          if(calc_recent_end_hour>23) {
            calc_recent_end_hour-=24;
          }

          if(i>0) { // calc middle hours 
            let previous_start_hour = Number(document.querySelector(`#supervisor_start_time_${i-1}_${sup_id}`).value.split(":")[0]);
            let previous_duration = Number(document.querySelector(`#supervisor_duration_${i-1}_${sup_id}`).value);
            let calc_previous = previous_start_hour+previous_duration;
            if(calc_previous>23) {
              calc_previous-=24;
            }
            if(calc_previous < recent_srart_hour) {
              calc_start_time = `${calc_previous}:00`;
            }
          }
          if(i == (proxy_length-1) && duty_duration>sum) { // calc first or last hours
            let calc_exact_end_hour = Number(duty_start_time.split(":")[0]) + duty_duration;
            if(calc_exact_end_hour>23) {
              calc_exact_end_hour-=24;
            }
            if(calc_recent_end_hour < calc_exact_end_hour) {
              calc_start_time = `${calc_recent_end_hour}:00`;
            }
          }

          let duty_type = document.querySelector(`#supervisor_duty_type_${i}_${sup_id}`).value;
          if(duty_type == "Proxy") {
            total_proxy++;
            total_sup_proxy++;
            proxy_count++;
          } else {
            total_swap++; 
            total_sup_swap++;
            swap_count++;
          }

          details.push({
            "id": proxy_id,
            "duty_type": duty_type,
            "start_time": document.querySelector(`#supervisor_start_time_${i}_${sup_id}`).value,
            "duration": document.querySelector(`#supervisor_duration_${i}_${sup_id}`).value
          });

          data.push(proxy_id);
        }

        if(sum==shift_duration) {
          duty_start_time = "--:--"
        } else if(calc_start_time){
          duty_start_time = calc_start_time;
        }

        duty_duration-=sum;  
        sup_proxy_index.push(sup_index);
        sup_proxy_details.push({
          "id": `${sup_id}`,
          "proxy_count": proxy_count,
          "swap_count": swap_count,
          "details": details
        });
      }

      shift_supervisor_ids.push(`${sup_id}`);
      sup_start_time_info.push(`${duty_start_time}`);
      sup_duration_info.push(`${duty_duration}`);

      sup_index++;
  });

  let supervisors = {
    "shift_supervisor_ids": shift_supervisor_ids,
    "sup_start_time_info": sup_start_time_info,
    "sup_duration_info": sup_duration_info,
    "sup_proxy_index": sup_proxy_index,
    "total_proxy": total_sup_proxy,
    "total_swap": total_sup_swap,
    "proxy_details": sup_proxy_details,
  }; 

  // operator collections
  let shift_operator_ids=[], op_start_time_info=[]; op_duration_info=[]; op_proxy_details=[], op_proxy_index=[], op_index=0;
  document.querySelector("#operator_infos").childNodes.forEach(function(item) {
    let duty_start_time = shift_start_time;
    let duty_start_hour = Number(duty_start_time.split(":")[0]);
    let duty_duration = shift_duration;
    let op_id = item.id.split("_")[3];

      if(document.querySelector(`#operator_${op_id}`).checked) {
        let details = [], calc_start_time="", sum=0, proxy_count=0, swap_count=0;
        let proxy_length = document.querySelector(`#operator_proxy_details_${op_id}`).children.length;
        
        for(let i=0; i<proxy_length; i++) {
          let proxy_id = document.querySelector(`#operator_list_${i}_${op_id}`).value;

          //---------- validation start ----------
          // operator list
          if(!document.querySelector(`#operator_list_${i}_${op_id}`).value) {
            customValidation(true, `operator_list_${i}_${op_id}`, error_message["required"]);
            error_count++;
          } else if(data.includes(proxy_id)) {
            customValidation(true, `operator_list_${i}_${op_id}`, error_message["duplicate"]);
            error_count++;
          } else {
            customValidation(false, `operator_list_${i}_${op_id}`, "");
          }

          // start time
          if(!document.querySelector(`#operator_start_time_${i}_${op_id}`).value) {
            customValidation(true, `operator_start_time_${i}_${op_id}`, error_message["required"]);
            error_count++;
          } else {
            customValidation(false, `operator_start_time_${i}_${op_id}`, "");
          }

          // duration
          sum += Number(document.querySelector(`#operator_duration_${i}_${op_id}`).value);
          if(!document.querySelector(`#operator_duration_${i}_${op_id}`).value || Number(document.querySelector(`#operator_duration_${i}_${op_id}`).value)<1) {
            customValidation(true, `operator_duration_${i}_${op_id}`, error_message["required"]);
            error_count++;
          } else if(sum>shift_duration){
            customValidation(true, `operator_duration_${i}_${op_id}`, `${error_message["exceed"]} ${shift_duration}`);
            error_count++;
          } else {
            customValidation(false, `operator_duration_${i}_${op_id}`, "");
          }
          //---------- validation end ----------

          // identify duty start time
          let recent_srart_hour = Number(document.querySelector(`#operator_start_time_${i}_${op_id}`).value.split(":")[0]);
          let recent_duration = Number(document.querySelector(`#operator_duration_${i}_${op_id}`).value);
          let calc_recent_end_hour = recent_srart_hour + recent_duration;
          if(calc_recent_end_hour>23) {
            calc_recent_end_hour-=24;
          }

          if(i>0) { // calc middle hours 
            let previous_start_hour = Number(document.querySelector(`#operator_start_time_${i-1}_${op_id}`).value.split(":")[0]);
            let previous_duration = Number(document.querySelector(`#operator_duration_${i-1}_${op_id}`).value);
            let calc_previous = previous_start_hour+previous_duration;
            if(calc_previous>23) {
              calc_previous-=24;
            }
            if(calc_previous < recent_srart_hour) {
              console.log("middle")
              calc_start_time = `${calc_previous}:00`;
            }
          }
          if(i == (proxy_length-1) && duty_duration>sum) { // calc first or last hours
            let calc_exact_end_hour = Number(duty_start_time.split(":")[0]) + duty_duration;
            if(calc_exact_end_hour>23) {
              calc_exact_end_hour-=24;
            }
            if(calc_recent_end_hour < calc_exact_end_hour) {
              console.log("first or last")
              calc_start_time = `${calc_recent_end_hour}:00`;
            }
          }

          let duty_type = document.querySelector(`#operator_duty_type_${i}_${op_id}`).value;
          if(duty_type == "Proxy") {
            total_proxy++;
            total_op_proxy++;
            proxy_count++;
          } else {
            total_swap++; 
            total_op_swap++;
            swap_count++;
          }

          details.push({
            "id": proxy_id,
            "duty_type": duty_type,
            "start_time": document.querySelector(`#operator_start_time_${i}_${op_id}`).value,
            "duration": document.querySelector(`#operator_duration_${i}_${op_id}`).value
          });

          data.push(proxy_id);
        }

        if(sum==shift_duration) {
          duty_start_time = "--:--"
        } else if(calc_start_time){
          duty_start_time = calc_start_time;
        }

        duty_duration-=sum;  
        op_proxy_index.push(op_index);
        op_proxy_details.push({
          "id": `${op_id}`,
          "proxy_count": proxy_count,
          "swap_count": swap_count,
          "details": details
        });
      }

      shift_operator_ids.push(`${op_id}`);
      op_start_time_info.push(`${duty_start_time}`);
      op_duration_info.push(`${duty_duration}`);

      op_index++;
  });

  let operators = {
    "shift_operator_ids": shift_operator_ids,
    "op_start_time_info": op_start_time_info,
    "op_duration_info": op_duration_info,
    "op_proxy_index": op_proxy_index,
    "total_proxy": total_op_proxy,
    "total_swap": total_op_swap,
    "proxy_details": op_proxy_details,
  }; 

  if(error_count>0) {
    Toast.fire({
      icon: 'error',
      title: `${error_count} ${(error_count < 2) ? "error" : "errors"} found!`
    })
    document.querySelector("#submit_btn").disabled = false;
    document.querySelector("#submit_btn_send_icon").classList.remove("d-none");
    document.querySelector("#submit_btn_spinner_icon").classList.add("d-none");
    $("#loading_div").fadeOut('slow');
    return;
  }

  // format data
  form_data.shift = document.querySelector("#shift").value;
  form_data.schedule = document.querySelector("#schedule").value;
  form_data.number_of_floater = document.querySelector("#number_of_floater").value;
  form_data.shift_start_time = shiftStartTime();
  form_data.shift_duration = shift_duration;
  form_data.has_custom_schedule = false;

  if(form_data.schedule == "custom") {
    form_data.has_custom_schedule = true;
    form_data.custom_day = document.querySelector("#custom_day").value;
    form_data.custom_schedule = document.querySelector("#custom_schedule").value;
    form_data.custom_schedule_reason = document.querySelector("#custom_schedule_reason").value;
  }

  form_data.total_sup_proxy = total_sup_proxy;
  form_data.total_sup_swap = total_sup_swap;
  form_data.total_op_proxy = total_op_proxy;
  form_data.total_op_swap = total_op_swap;
  form_data.total_proxy = total_sup_proxy + total_op_proxy;
  form_data.total_swap = total_sup_swap + total_op_swap;
  form_data.supervisors = supervisors;
  form_data.operators = operators;

  // confirmation before submit
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, confirm!',
  }).then((result) => {
    if (result.isConfirmed) {
      document.querySelector("#submit_btn").disabled = true;
      document.querySelector("#submit_btn_send_icon").classList.add("d-none");
      document.querySelector("#submit_btn_spinner_icon").classList.remove("d-none");
      $("#loading_div").fadeIn();
      
      // save record
      saveData(form_data);

      $("#custom_schedule_div").hide("slow");
      $("#shift_supervisor_div").hide("slow");
      $("#shift_operator_div").hide("slow");
      
      setTimeout(function() {
        document.querySelector("#submit_btn").disabled = true;
        document.querySelector("#submit_btn_send_icon").classList.remove("d-none");
        document.querySelector("#submit_btn_spinner_icon").classList.add("d-none");
      }, 2000);
      $("#loading_div").fadeOut('slow');
    }
  })
});


//-----Refreah page
document.querySelector("#close_btn").addEventListener("click", (e) => {
  Swal.fire({
    title: 'Are you sure?',
    text: "Your input data will be vanish!",
    icon: 'info',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, refresh!'
  }).then((result) => {
    if (result.isConfirmed) {
      clearStorage();
      location.reload();
    }
  })
});


//-----clear session storage
function clearStorage() {
  sessionStorage.removeItem("supervisorInfo");
  sessionStorage.removeItem("operatorInfo");
  sessionStorage.removeItem("shiftInfo");
  sessionStorage.removeItem("shiftTypeInfo"); 
}


