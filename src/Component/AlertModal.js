function AlertModal(props){
  return (
    <>
      <div id={props.id} className="modal" tabindex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{props.title}</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>{props.text}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default AlertModal();