var timeListOneHourDuration = [
    "1:00 am", "2:00 am", "3:00 am", "4:00 am", "5:00 am", "6:00 am", "7:00 am", "8:00 am", "9:00 am", "10:00 am", "11:00 am", "12:00 pm", 
    "1:00 pm", "2:00 pm", "3:00 pm", "4:00 pm", "5:00 pm", "6:00 pm", "7:00 pm", "8:00 pm", "9:00 pm", "10:00 pm", "11:00 pm", "12:00 am"
];


// time picker for 1 hour duration
function timePickerFullHour(start_time, duration, field_id) {
    let start_time_index = timeListOneHourDuration.indexOf(start_time);
    input_field = document.querySelector(field_id);
    input_field.innerHTML = ''; // clear previous options

    if(start_time_index<0) { // not matched or found
        return createTimeOptions(0, 24, input_field);
    }

    let end_time_index = start_time_index + duration;
    if(end_time_index>24) { // overnight e.g. 10:00 pm to 6:00 am
        createTimeOptions(start_time_index, 24, input_field);
        end_time_index -= 24;
        start_time_index = 0;
    }
    return createTimeOptions(start_time_index, end_time_index, input_field);
}


// create time select option with limt
function createTimeOptions(start, limit, input_field) {
    for(let i=start; i<limit; i++) {
        let option = document.createElement("option");
        option.value = timeListOneHourDuration[i];
        option.text = timeListOneHourDuration[i];
        input_field.appendChild(option);
    }

    $(input_field).select2({
        placeholder: `Select start time`,
        allowClear: true
      });
}


// calculate remaining shift duration and next start time
function remainingShiftDurationAndNextStartTime(designation, id, count) {
    let sum=0;
    if(count>0) { // multiple rows
        for(let i=0; i<=count; i++) {
            sum += Number(document.querySelector(`#${designation}_duration_${i}_${id}`).value);
        }
    } else {
        sum = Number(document.querySelector(`#${designation}_duration_${count}_${id}`).value);
    }

    let new_duration = shiftDuration() - sum;
    if(new_duration<1) {
        return {
        "allowed": false,
        "exceed_duration": -(new_duration),
        }
    }

    let pre_duration = Number(document.querySelector(`#${designation}_duration_${count}_${id}`).value);
 
    let pre_start_time = document.querySelector(`#${designation}_start_time_${count}_${id}`).value;

    let pre_start_time_index = timeListOneHourDuration.indexOf(pre_start_time);
    if(pre_start_time_index<0) { // not found
        pre_start_time_index = 0;
    }

    let new_start_time_index = pre_start_time_index + pre_duration;
    if(new_start_time_index>23) {
        new_start_time_index-=24;
    }
    let new_start_time = timeListOneHourDuration[new_start_time_index];
    
    return {
        "allowed": true,
        "new_start_time": new_start_time,
        "new_duration": new_duration,
    }
}


// duration validation check
function durationCalculation(designation, id, sl) {
    let sum=0;
    if(sl>0) { // multiple rows
        for(let i=0; i<sl; i++) {
            sum += Number(document.querySelector(`#${designation}_duration_${i}_${id}`).value);
        }
    }

    let remaining_duration = shiftDuration() - sum;
    let input_duration = Number(Number(document.querySelector(`#${designation}_duration_${sl}_${id}`).value));
    if(input_duration > remaining_duration) {
        document.querySelector(`#${designation}_duration_${sl}_${id}`).value = remaining_duration;
    } else if(input_duration < 1) {
        document.querySelector(`#${designation}_duration_${sl}_${id}`).value = 1;
    } else {
        document.querySelector(`#${designation}_duration_${sl}_${id}`).value = input_duration;
    }
}