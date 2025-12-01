import {useDynamicSlice} from "@/store/hooks.ts";
import {
  type ConfigsActions,
  createConfigsSlice,
  type ConfigsState
} from "@/app/config/configsSlice.ts";
import {type Column, ReactGrid, type Row} from "@silevis/reactgrid";
import "@silevis/reactgrid/styles.css";

function DemoGridView() {
  const {
    state: configsState,
    // actions: configsActions,
    // dispatch
  } = useDynamicSlice<ConfigsState, ConfigsActions>("CONFIGS", createConfigsSlice)

  const getRows = (list?: Record<string, string> []): Row[] => {
    console.log('list:', list)
    return [
      headerRow,
      ...list?.map<Row>((row, idx) => ({
        rowId: idx,
        cells: [
          { type: "text", text: row['VAL'], nonEditable: true},
          { type: "text", text: row['VAL2'], nonEditable: true},
        ]
      })) ?? []
    ]
  }

  const headerRow: Row = {
    rowId: "header",
    cells: [
      { type: "header", text: "VAL" },
      { type: "header", text: "VAL2" }
    ]
  };

  const getColumns = (): Column[] => [
    { columnId: "name", width: 150 },
    { columnId: "surname", width: 150 }
  ];


  console.log(getRows(configsState?.configs['설정1.xlsx']))
  return (
    <div style={{display: "flex", flexDirection: "column", width: "100%", height: "100%", minHeight: 0}}>
      <div style={{flex: "0 0 25px"}}>DemoGridView</div>
      <div style={{flex: 1, minHeight: 0, overflow: "auto"}}>
        {configsState !== undefined &&
            <ReactGrid
                rows={getRows(configsState?.configs['설정1.xlsx'])}
                columns={getColumns()}
                stickyTopRows={1}
                enableRangeSelection={true}
            />
        }
      </div>
    </div>
  )
}

export default DemoGridView
