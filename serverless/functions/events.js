const setVoiceActivity = (event, reservationStatus) => {

  const { EventType, TransferMode } = event;

  if(EventType === "reservation.created") {
    return "waiting"
  }
  
  if(EventType === "reservation.accepted") {
    return "busy"
  }

  if(
      (EventType === "task.transfer-initiated" || EventType === "task.transfer-completed") && 
      TransferMode === "WARM"
  ) {
    return "warm-transfer"
  }

  if(
    !(EventType === "task.transfer-initiated" || EventType === "task.transfer-completed") && 
    TransferMode === "WARM"
  ) {

    if(reservationStatus === "accepted") {

      return "busy";

    }

  }

  return ""

}

const getWorkerInfo = async (client, event) => {

  const { WorkerSid, WorkerAttributes, ResourceType } = event;
  const { WORKSPACE_SID } = process.env;
  
  let attributes = WorkerAttributes && JSON.parse(WorkerAttributes);
  let workerSid = WorkerSid;
  let reservationStatus = null;
  
  if(ResourceType === "transfer") {

    const { TaskSid, TransferInitiatingReservationSid }  = event;
    
    const reservation = await client.taskrouter.workspaces(WORKSPACE_SID)
              .tasks(TaskSid)
              .reservations(TransferInitiatingReservationSid)
              .fetch();

    if(reservation) {

      ({ workerSid, reservationStatus} = reservation);

      const worker = await client.taskrouter.workspaces(WORKSPACE_SID)
              .workers(workerSid)
              .fetch();

      attributes = JSON.parse(worker.attributes);

    }

  }


  return {
    workerSid,
    attributes, 
    reservationStatus
  }

}

exports.handler = async (context, event, callback) => {

  const { ResourceType, TaskChannelUniqueName, TransferMode } = event; 
  const { WORKSPACE_SID } = process.env;

  if(
      ((ResourceType === "reservation" )  || 
      (ResourceType === "transfer" && TransferMode === "WARM")
    ) && 
    TaskChannelUniqueName === "voice"
  ) {

    const client = context.getTwilioClient();

    const { workerSid, attributes, reservationStatus } = await getWorkerInfo(
      client, 
      event 
    );

    const voiceActivity = setVoiceActivity(event, reservationStatus);

    await client.taskrouter.workspaces(WORKSPACE_SID)
      .workers(workerSid)
      .update({
        attributes: JSON.stringify({
          ...attributes,
          voiceActivity
        })
      })

  }

  callback(null);

};
