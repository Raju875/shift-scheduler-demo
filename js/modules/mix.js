var form_data = {};
var validate = [];
var validate_ids = ["list", "start_time", "duration"];
var error_message = {
  "required": "Required",
  "duplicate": "Duplicate value",
  "exceed": "Exceed limit",
  "option_remain": "options remain"
};


// toast message configuration
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 6000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})



// show employee list in modal
document.querySelector("#show_employee_list").addEventListener("click", (e) => {

    $("#loading_div_modal").fadeIn('slow');

    let getSupervisorInfo = JSON.parse(sessionStorage.getItem("supervisorInfo"));
    let sup_list_modal_html = document.getElementById('modal_supervisor_list');
    sup_list_modal_html.innerHTML = '';
    
    // supervisor list
    if(getSupervisorInfo.length>0) {
        for(let i=0; i<getSupervisorInfo.length; i++) {
        let designation = getSupervisorInfo[i].designation.split(",");
        let supervisor_designation = '';
        for(let i=0; i<designation.length; i++) {
            supervisor_designation += designation[i] + "<br>"
        }
        sup_list_modal_html.innerHTML += `<tr class="align-middle">
                                            <td>${i+1}</td>
                                            <td>${getSupervisorInfo[i].employee_id}</td>
                                            <td>${getSupervisorInfo[i].shift_name}</td>
                                            <td>${getSupervisorInfo[i].name}</td>
                                            <td>${supervisor_designation}</td>
                                            </tr>`;
        }
    }

    // operator list
    let getOperatorInfo = JSON.parse(sessionStorage.getItem("operatorInfo"));
    let op_list_modal_html = document.getElementById('modal_operator_list');
    op_list_modal_html.innerHTML = '';
    if(getOperatorInfo.length>0) {
        for(let i=0; i<getOperatorInfo.length; i++) {
        op_list_modal_html.innerHTML += `<tr class="align-middle">
                                            <td>${i+1}</td>
                                            <td>${getOperatorInfo[i].employee_id}</td>
                                            <td>${getOperatorInfo[i].shift_name}</td>
                                            <td>${getOperatorInfo[i].name}</td>
                                            </tr>`;
        }
    }

    // shift list
    let getShiftInfo = JSON.parse(sessionStorage.getItem("shiftInfo"));
    let shift_list_modal_html = document.getElementById('modal_shift_list');
    shift_list_modal_html.innerHTML = '';
    if(getShiftInfo.length>0) {
        for(let i=0; i<getShiftInfo.length; i++) {

        // format shift supervisor
        let schedule_name = getShiftInfo[i].schedule_name.split(", ");
        let shift_schedule_names = '';
        if(schedule_name[0] != 'undefined') {
            for(let i=0; i<schedule_name.length; i++) {
            shift_schedule_names += schedule_name[i] + "<br>"
            }
        } else {
            shift_schedule_names = '--';
        }

        // format shift supervisor
        let supervisor_name = getShiftInfo[i].supervisor_name.split(", ");
        let shift_sup_names ='';
        if(supervisor_name[0] != 'undefined') {
            for(let i=0; i<supervisor_name.length; i++) {
            shift_sup_names += supervisor_name[i] + "<br>"
            }
        } else {
            shift_sup_names = '--';
        }

        // format shift operator
        let operators_name = getShiftInfo[i].operators_name.split(", ");
        let shift_op_names = '';
        if(operators_name[0] != 'undefined') {
            for(let i=0; i<operators_name.length; i++) {
            shift_op_names += operators_name[i] + "<br>"
            }
        } else {
            shift_op_names = '--';
        }

        shift_list_modal_html.innerHTML += `<tr class="align-middle">
                                            <td>${getShiftInfo[i].name}</td>
                                            <td>${getShiftInfo[i].max_team_size ? getShiftInfo[i].max_team_size : ''}</td>
                                            <td>${shift_sup_names}</td>
                                            <td>${shift_op_names}</td>
                                            <td>${shift_schedule_names}</td>
                                            </tr>`;
        }
    }
    // shift type list
    let getShiftTypeInfo = JSON.parse(sessionStorage.getItem("shiftTypeInfo"));
    let shift_type_list_modal_html = document.getElementById('modal_shift_type_list');
    shift_type_list_modal_html.innerHTML = '';
    if(getShiftTypeInfo.length>0) {
        for(let i=0; i<getShiftTypeInfo.length; i++) {
        shift_type_list_modal_html.innerHTML += `<tr class="align-middle">
                                                    <td>${getShiftTypeInfo[i].name}</td>
                                                    <td>${(getShiftTypeInfo[i]["DST?"] != "undefined") ? getShiftTypeInfo[i]["DST?"] : false}</td>
                                                    <td>${getShiftTypeInfo[i].start_time}</td>
                                                    <td>${getShiftTypeInfo[i].end_time}</td>
                                                    <td>${getShiftTypeInfo[i].duration}</td>
                                                    <td>${getShiftTypeInfo[i].shift_name}</td>
                                                </tr>`;
        }
    }

    $("#loading_div_modal").fadeOut('slow');
});