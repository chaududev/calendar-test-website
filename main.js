let lastId = 0;
$(() => {
    const currentDate = new Date();
  
    const getLocations = function (date) {
      const timeZones = DevExpress.utils.getTimeZones(date);
      return timeZones.filter((timeZone) => locations.indexOf(timeZone.id) !== -1);
    };
  
    const demoLocations = getLocations(currentDate);
  
    const scheduler = $('#scheduler').dxScheduler({
      dataSource: data,
      views: ['workWeek'],
      timeZone: demoLocations[0].id,
      currentView: 'workWeek',
      currentDate,
      startDayHour: 8,
      height: 600,
      editing: {
        allowTimeZoneEditing: true,
      },
      onOptionChanged(e) {
        if (e.name === 'currentDate') {
          locationSwitcher.option('items', getLocations(e.value));
        }
      },
      onAppointmentUpdated: function (e) {
        const {appointmentData}= e;
        var dataLocal = JSON.parse(localStorage.getItem("Schedure"))
        var indexElement  = dataLocal.map(e=>e.id).indexOf(appointmentData.id);
        dataLocal[indexElement]=appointmentData
       console.log(dataLocal)
        localStorage.setItem("Schedure",JSON.stringify(dataLocal))
  
     },
     onAppointmentDeleted: function (e){
        const {appointmentData}= e;
        var dataLocal = JSON.parse(localStorage.getItem("Schedure"))
        var indexElement  = dataLocal.map(e=>e.id).indexOf(appointmentData.id);
        dataLocal.splice(indexElement,1);
        console.log(dataLocal)
        localStorage.setItem("Schedure",JSON.stringify(dataLocal))
     },
      onAppointmentAdding(e){
         const {appointmentData}= e;
       var dataLocal = JSON.parse(localStorage.getItem("Schedure"))
     //  data = dataLocal===null?[]:dataLocal;
     
       if(dataLocal===null){
        data=[];
       }else{
          data=dataLocal;
          lastId = data[data.length-1].id;
       }
       lastId=lastId+1;
         var payload = {
            text:appointmentData.text,
            startDate:appointmentData.startDate,
            endDate:appointmentData.endDate,
            id:lastId
         }
         if(appointmentData.allDay){
            payload.recurrenceRule='FREQ=DAILY'
         }
         data.push(payload);
         localStorage.setItem("Schedure",JSON.stringify(data))
        
      },
      onAppointmentFormOpening(e) {
        const { form } = e;
  
        const startDateTimezoneEditor = form.getEditor('startDateTimeZone');
        const endDateTimezoneEditor = form.getEditor('endDateTimeZone');
        const startDateDataSource = startDateTimezoneEditor.option('dataSource');
        const endDateDataSource = endDateTimezoneEditor.option('dataSource');
  
        startDateDataSource.filter(['id', 'contains', 'Europe']);
        endDateDataSource.filter(['id', 'contains', 'Europe']);
  
        startDateDataSource.load();
        endDateDataSource.load();
      },
      
    }).dxScheduler('instance');
  
    const locationSwitcher = $('#location-switcher').dxSelectBox({
      items: demoLocations,
      displayExpr: 'title',
      valueExpr: 'id',
      width: 240,
      value: demoLocations[0].id,
      onValueChanged(data) {
        scheduler.option('timeZone', data.value);
      },
    }).dxSelectBox('instance');
  });
  
  const locations = ['Europe/London', 'Europe/Berlin', 'Europe/Helsinki','Asia/Saigon'];
  let data=[];

  window.onload = (event) => {
      var dataReceive= localStorage.getItem("Schedure")
     if(dataReceive!=null){
        data=JSON.parse(localStorage.getItem("Schedure"))
     }

  };
  