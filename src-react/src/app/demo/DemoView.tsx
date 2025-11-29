function DemoView() {
  const startScript = () => {
    window.pywebview.api.start_script("job_id_01", "hello_world.py", ["한글 스페이스", "두번째 음냐"])
      .then(() => {
        console.log("done")
      })
  }
  const stopScript = () => {
    window.pywebview.api.stop_script("job_id_01")
      .then(() => {
        console.log("done")
      })
  }

  return (
    <div className="demo">
      <div>Demo</div>
      <div onClick={() => startScript()}>
        Start
      </div>
      <div onClick={() => stopScript()}>
        Stop
      </div>
    </div>
  )
}

export default DemoView
