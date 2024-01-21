import clsx from 'clsx'
import React from 'react'
import style from './cardUser.module.scss'
import { Image } from 'react-bootstrap'

export default function CardUser() {
  return (
    <div className={clsx(style.cardUser)}>
      <Image className={clsx(style.cardUserImg)} src='https://static.vecteezy.com/system/resources/previews/020/911/740/original/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png'/>
      <div className={clsx(style.cardUserInf)}>
        <p>Name</p>
        <p>Email</p>
      </div>
    </div>
  )
}
