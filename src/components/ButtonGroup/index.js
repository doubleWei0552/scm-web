import React from 'react'
import { Menu, Dropdown, Button, Icon, message, Popconfirm } from 'antd';
import ComModal from '@/components/ConfirmModel/index'
import ReactDOM from 'react-dom';
import styles from './Index.less'

export default class ButtonGroup extends React.Component {
  state = {
    ButtonGroupData: [],  //所有的按钮总数，不包括删除和编辑
    cacheData: {},  //分组的按钮，key是一组，
    NoGroup: [],  //未分组的按钮
  }

  componentWillReceiveProps = (newProps) => {
    this.setState({
      ButtonGroupData: newProps.buttonData
    })
    let cacheData = {}
    let NoGroup = []
    newProps.buttonData.map(item => {
      if (item.BUTTON_GROUP) { //分组的按钮
        if (cacheData[item.BUTTON_GROUP]) {
          cacheData[item.BUTTON_GROUP].push(item)
        } else {
          cacheData[item.BUTTON_GROUP] = [item]
        }
      } else {  //未分组的按钮
        NoGroup.push(item)
      }
    })
    this.setState({
      cacheData,
      NoGroup
    })
  }

  handleCancel = () => {
    this.ComModal.handleCancel()
  }

  handleButtonClick = (e) => {
    if (!e.READ_ONLY_CONDITION) {
      if (e.CONFIRM) {
        const div = document.createElement('div')
        document.body.appendChild(div)
        const ComModalProps = {
          handleOk: () => {
            if (e.FIELD_NAME == 'newCustUser' || e.FIELD_NAME == 'newSupplier') {
              this.props.openAccount(e)
            } else {
              this.props.onButtonEvent(e)
            }
            this.handleCancel()
          },
          handleCancel: this.handleCancel,
          message: e.CONFIRM_MESSAGE ? e.CONFIRM_MESSAGE : '确定执行本次操作?'
        }
        ReactDOM.render(<ComModal ref={dom => (this.ComModal = dom)} store={window.g_app._store} {...ComModalProps} />, div)
      } else {
        this.props.onButtonEvent(e)
      }
    }
  }

  ButtonRender = () => {
    let groupDate = this.state.cacheData
    let loopData = []
    for (let i in groupDate) {
      loopData.push(groupDate[i])
    }
    return loopData.map((ii, jj) => {
      let firstButton = {}
      const menu = (
        <Menu>
          {ii.map((item, index) => {

            if (!ii.DISPLAY_CONDITION) {  //避免第一个按钮是不显示的按钮的bug
              if (_.isEmpty(firstButton)) {
                firstButton = item
              }
            }
            if (index == 0) return
            return item.CONFIRM ? (
              item.READ_ONLY_CONDITION ? (
                <Menu.Item disabled={item.READ_ONLY_CONDITION}
                  key={index}
                  style={{
                    minWidth: '100px',
                    display: item.DISPLAY_CONDITION ? '' : 'none',
                  }}>
                  {item.LABEL}
                </Menu.Item>
              ) : (
                  <Menu.Item disabled={item.READ_ONLY_CONDITION}
                    key={index}
                    onClick={() => {
                      if (item.FIELD_NAME == 'newCustUser') {
                        this.props.openAccount(item)
                      } else {
                        const div = document.createElement('div')
                        document.body.appendChild(div)
                        const ComModalProps = {
                          handleOk: () => {
                            this.props.onButtonEvent(item)
                            this.handleCancel()
                          },
                          handleCancel: this.handleCancel,
                          message: item.CONFIRM_MESSAGE ? item.CONFIRM_MESSAGE : '确定执行本次操作?'
                        }
                        ReactDOM.render(<ComModal ref={dom => (this.ComModal = dom)} store={window.g_app._store} {...ComModalProps} />, div)
                      }
                    }}
                    style={{
                      minWidth: '100px',
                      display: item.DISPLAY_CONDITION ? '' : 'none',
                    }}>
                    {item.LABEL}
                  </Menu.Item>
                )
            ) : (
                <Menu.Item disabled={item.READ_ONLY_CONDITION}
                  onClick={() => {
                    if (item.FIELD_NAME == 'newCustUser') {
                      this.props.openAccount(item)
                    } else {
                      this.props.onButtonEvent(item)
                    }
                  }}
                  key={index}
                  style={{
                    minWidth: '100px',
                    display: item.DISPLAY_CONDITION ? '' : 'none',
                  }}>
                  {item.LABEL}
                </Menu.Item>
              );
          })}
        </Menu>
      );
      return <div key={firstButton.LABEL} style={{ display: 'inline-block' }}>
        <Button style={{ borderRight: 'none', borderBottomRightRadius: '0', borderTopRightRadius: '0' }}
          disabled={firstButton.READ_ONLY_CONDITION} onClick={() => this.handleButtonClick(firstButton)}>
          {firstButton.LABEL}
        </Button>
        <Dropdown.Button trigger={['click']} className={styles.DropdownButton} key={jj}
          style={{ marginRight: '10px' }} overlay={menu} />
      </div>

    })
  }
  NoGroupButton = () => {
    if (this.state.NoGroup.length) {
      return this.state.NoGroup.map((value, index) => {
        return value.CONFIRM ? (
          value.READ_ONLY_CONDITION ? (
            <Button
              disabled
              key={index}
              style={{
                marginRight: '10px',
                display: value.DISPLAY_CONDITION ? 'inline-block' : 'none',
              }}
            >
              {value.LABEL}
            </Button>
          ) : (
              <Button
                key={index}
                style={{
                  marginRight: '10px',
                  display: value.DISPLAY_CONDITION ? 'inline-block' : 'none',
                }}
                onClick={() => {
                  if (value.FIELD_NAME == 'newCustUser' || value.FIELD_NAME == 'newSupplier') {
                    this.props.openAccount(value)
                  } else {
                    const div = document.createElement('div')
                    document.body.appendChild(div)
                    const ComModalProps = {
                      handleOk: () => {
                        this.props.onButtonEvent(value)
                        this.handleCancel()
                      },
                      handleCancel: this.handleCancel,
                      message: value.CONFIRM_MESSAGE ? value.CONFIRM_MESSAGE : '确定执行本次操作?'
                    }
                    ReactDOM.render(<ComModal ref={dom => (this.ComModal = dom)} store={window.g_app._store} {...ComModalProps} />, div)
                  }

                }}
              >
                {value.LABEL}
              </Button>
            )
        ) : (
            <Button
              disabled={value.READ_ONLY_CONDITION}
              onClick={() => {
                if (value.FIELD_NAME == 'newCustUser' || value.FIELD_NAME == 'newSupplier') {
                  this.props.openAccount(value)
                } else {
                  this.props.onButtonEvent(value)
                }
              }}
              key={index}
              style={{
                marginRight: '10px',
                display: value.DISPLAY_CONDITION ? 'inline-block' : 'none',
              }}
            >
              {value.LABEL}
            </Button>
          );
      })
    }
  }
  render() {
    return (
      <div style={{ display: 'inline-block' }}>
        {this.NoGroupButton()}
        {this.ButtonRender()}
      </div>
    )
  }
}