import React, { useState, useImperativeHandle, forwardRef } from 'react'
import PropTypes from 'prop-types'

const Togglable = forwardRef(({ children, buttonLabel = 'show' }, ref) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(ref, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <div>
      {!visible &&
                <button onClick={toggleVisibility}>{buttonLabel}</button>
      }
      {visible &&
                <div>
                  {children}
                  <button onClick={toggleVisibility}>cancel</button>
                </div>
      }
    </div>
  )
})

Togglable.displayName = 'Togglable'

Togglable.propTypes = {
  children: PropTypes.node.isRequired,
  buttonLabel: PropTypes.string,
}

export default Togglable