import React from 'react'
import clsx from 'clsx'
import Style from './layoutLogin.module.scss'
import { Outlet } from 'react-router'

export default function LayoutLogin() {
  return (
    <div className={clsx(Style.container)}>
      <div className={clsx(Style.wrap)}>
        <Outlet></Outlet>
      </div>
    </div>
  )
}
