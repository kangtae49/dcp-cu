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

  const openSetting = () => {
    window.pywebview.api.start_data_file('설정1.xlsx')
  }

  const readExcel = () => {
    window.pywebview.api.read_data_excel('설정1.xlsx', null).then(res => {
      console.log(res)

    })
  }

  return (
    <div className="demo">
      <div>Demo</div>
      <div onClick={() => startScript()}>
        Start Job
      </div>
      <div onClick={() => stopScript()}>
        Stop Job
      </div>

      <div onClick={() => openSetting()}>
        Open Setting
      </div>

      <div onClick={() => readExcel()}>
        read Excel
      </div>

    </div>
  )
}

export default DemoView
