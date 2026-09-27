const Airtable = require("airtable");
const base = new Airtable({ apiKey: "keyN5W9UOeZHVdNOS" }).base("app7U9p6fBEtrXjzl");


function fetchShift() {
    console.log(base.tables[1 ]);
    let shiftInfo = []
    base("Shift")
      .select({
        sort: [{ field: "Name", direction: "asc" }],
      })
      .eachPage(
        function page(records, fetchNextPage) {
          records.forEach(function (record) {
            var option = document.createElement("option");
            option.value = record.id;
            option.text = record.get("Name");
            document.querySelector("#shift").appendChild(option);
            shiftInfo.push({
              "id": record.id,
              "name": `${record.get("Name")}`,
              "schedule_name": `${record.get("Schedule Name")}`,
              "shift_type_name": `${record.get("Shift Type Name")}`,
              "supervisor_name": `${record.get("Supervisor Name")}`,
              "operators_name": `${record.get("Operators Name")}`,
              "max_team_size": record.get("Max team size")
            });

          });
          fetchNextPage();
        },
        function done(err) {
          if (err) {
            console.error(err);
            return;
          }
          sessionStorage.setItem('shiftInfo', JSON.stringify(shiftInfo));
        }
      ); 
}



function fetchShiftType() {
    let shiftTypeInfo = []
    base("Shift type")
      .select({
        sort: [{ field: "Sequence", direction: "asc" }],
      })
      .eachPage(
        function page(records, fetchNextPage) {
          records.forEach(function (record) {
            shiftTypeInfo.push({
              "id": record.id,
              "name": `${record.get("Name")}`,
              "DST?": `${record.get("DST?")}`,
              "start_time": `${record.get("Start time")}`,
              "end_time": `${record.get("End time")}`,
              "shift_id": `${record.get("Shift")}`,
              "shift_name": `${record.get("Shift Name")}`,
              "duration": record.get("Duration")
            });

          });
          fetchNextPage();
        },
        function done(err) {
          if (err) {
            console.error(err);
            return;
          }
          sessionStorage.setItem('shiftTypeInfo', JSON.stringify(shiftTypeInfo));
        }
      );
}



function fetchEmployee() {
    let supervisorInfo = [], operatorInfo = [];
    base("Employees").select({
        sort: [{ field: "Employee ID", direction: "desc" }],
        // view: "All employees"
      })
      .eachPage(
        function page(records, fetchNextPage) {
          records.forEach(function (record) {
  
            if(record.get("Shift (op)")) {
              operatorInfo.push({
                "id": record.id,
                "employee_id": `${record.get("Employee ID")}`,
                "name": `${record.get("Name")}`,
                "user_type_id": `${record.get("User type")}`,
                "uset_type": `${record.get("User Type Name")}`,
                "shift_id": record.get("Shift (op)"),
                "shift_name": `${record.get("Name Shift (op)")}`
              });
  
            } 
            if(record.get("Shift (sup)")) {
              supervisorInfo.push({
                "id": record.id,
                "employee_id": `${record.get("Employee ID")}`,
                "name": `${record.get("Name")}`,
                "shift_id": record.get("Shift (sup)"),
                "shift_name": record.get("Name Shift (sup)"),
                "designation": `${record.get("User Type Name")}`,
              });
            }
          });
          fetchNextPage();
        },
        function done(err) {
          if (err) {
            console.error(err);
            return;
          }
          sessionStorage.setItem('supervisorInfo', JSON.stringify(supervisorInfo));
          sessionStorage.setItem('operatorInfo', JSON.stringify(operatorInfo));
        }
      );
}



function fetchShiftScheduleByShift(scheduleById, selectedShift) {
    // shift schedule
    base("Shift schedule")
    .select({
        sort: [{ field: "ID", direction: "asc" }],
    })
    .eachPage(
        function page(records, fetchNextPage) {
            records.forEach(function (record) {
                if(record.get("Shift") == selectedShift) {
                    let schedule_option = document.createElement("option");
                    schedule_option.value = record.id;
                    schedule_option.text = record.get("ID");
                    schedule_option.setAttribute('start-time', record.get("Start time"));
                    schedule_option.setAttribute('end-time', record.get("End time"));
                    schedule_option.setAttribute('duration', record.get("Durations(hour)"));
                    scheduleById.appendChild(schedule_option);
                }
            });
            fetchNextPage();
        },
        function done(err) {
        if (err) {
            console.log(err);
            return;
        }
        let schedule_option = document.createElement("option");
        schedule_option.value = 'custom';
        schedule_option.text = 'Custom';
        scheduleById.appendChild(schedule_option);
        }
    );
}



function saveData(form_data) {
    base('Operations').create([
        {
          "fields": {
            "Shift": [form_data.shift],
            "Shift Schedule": (form_data.has_custom_schedule) ? [] : [form_data.schedule],
            "Number of floters": Number(form_data.number_of_floater),
            "Has Custom Schedule": form_data.has_custom_schedule,
            "Custom day": form_data.custom_day,
            "Custom Schedule": (form_data.has_custom_schedule) ? [form_data.custom_schedule] : [],
            "Custom Schedule Reason": form_data.custom_schedule_reason,
            "Total Supervisor": form_data.supervisors.shift_supervisor_ids.length,
            "Total Operator": form_data.operators.shift_operator_ids.length,
            "Total Proxy": form_data.total_proxy,
            "Total Swap": form_data.total_swap,
            "Total Supervisor Proxy": form_data.total_sup_proxy,
            "Total Supervisor Swap": form_data.total_sup_swap,
            "Total Operator Proxy": form_data.total_op_proxy,
            "Total Operator Swap": form_data.total_op_swap,
            "Operation JSON": `${ JSON.stringify(form_data)}`
          }
        }
      ], function(err, records) {
        if (err) {
          Toast.fire({
            icon: 'error',
            title: `Something went wrong! Try again.`
          });
          console.error(err);
          $("#loading_div").fadeOut('slow');
          return;
        }
        records.forEach(function (record) {

          navigator.clipboard.writeText(record.get("ID")); // copy to clipboard
          clearStorage();

          document.querySelector("#shift").innerHTML = "";
          document.querySelector("#schedule").innerHTML = "";
          document.querySelector("#shift_supervisor").innerHTML = "";
          document.querySelector("#supervisor_infos").innerHTML = "";
          document.querySelector("#operator_infos").innerHTML = "";
          document.querySelector("#shift_operator").innerHTML = "";
          
          Swal.fire(
            "",
            `Your shift has been started. <a target="_blank" href="https://airtable.com/app7U9p6fBEtrXjzl/pag9GJdA7deRPkJiI">Click here</a> to see the details.
            ID: ${record.get("ID")}`,
            'success'
          )
        });
      });
}
