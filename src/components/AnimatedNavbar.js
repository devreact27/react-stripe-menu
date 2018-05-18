import React, { Component, Fragment } from "react"
import styled from "styled-components"
import Navbar from "./Navbar"
import NavbarItem from "./Navbar/NavbarItem"
import Flipper from "./Flipper"
import DropdownContainer from "./DropdownContainer"
import CompanyDropdown from "./DropdownContents/CompanyDropdown"
import DevelopersDropdown from "./DropdownContents/DevelopersDropdown"
import ProductsDropdown from "./DropdownContents/ProductsDropdown"
import TransitionContents from "./DropdownContainer/TransitionContents"

const navbarConfig = [
  { title: "Products", dropdown: ProductsDropdown },
  { title: "Developers", dropdown: DevelopersDropdown },
  { title: "Company", dropdown: CompanyDropdown }
]

export default class AnimatedNavbar extends Component {
  state = { activeIndex: undefined, prevActiveIndex: undefined, animatingOut: false }

  onMouseEnter = i => {
    this.setState(prevState => ({
      activeIndex: i,
      prevActiveIndex: prevState.activeIndex
    }))
  }

  onMouseLeave = () => {
    if (this.state.animatingOut) return
    this.setState({
      animatingOut: true
    })
    setTimeout(() => {
      this.setState({
        animatingOut: false,
        activeIndex: undefined
      })
    }, this.props.tweenConfig.duration)
  }

  getNavbarItemContents = (index, direction) => {
    if (index === this.state.activeIndex) {
      const PrevDropdown =
        navbarConfig[this.state.prevActiveIndex] !== undefined &&
        navbarConfig[this.state.prevActiveIndex].dropdown
      const CurrentDropdown = navbarConfig[this.state.activeIndex].dropdown
      return (
        <DropdownContainer direction={direction} animatingOut={this.state.animatingOut}>
          <TransitionContents direction={direction} tweenConfig={this.props.tweenConfig}>
            <CurrentDropdown />
          </TransitionContents>
          {PrevDropdown && (
            <TransitionContents
              animatingOut
              direction={direction}
              tweenConfig={this.props.tweenConfig}
            >
              <PrevDropdown />
            </TransitionContents>
          )}
        </DropdownContainer>
      )
    }
    return null
  }

  render() {
    const { tweenConfig } = this.props
    let direction = null
    if (this.state.prevActiveIndex !== undefined) {
      direction = this.state.activeIndex > this.state.prevActiveIndex ? "forwards" : "backwards"
    }

    return (
      <Flipper flipKey={this.state.activeIndex} tweenConfig={tweenConfig}>
        <Navbar onMouseLeave={this.onMouseLeave}>
          {navbarConfig.map((n, i) => {
            return (
              <NavbarItem title={n.title} index={i} onMouseEnter={this.onMouseEnter}>
                {this.getNavbarItemContents(i, direction)}
              </NavbarItem>
            )
          })}
        </Navbar>
      </Flipper>
    )
  }
}
