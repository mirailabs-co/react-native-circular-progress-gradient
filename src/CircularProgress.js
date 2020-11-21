import React from 'react';
import PropTypes from 'prop-types';
import { TouchableOpacity, View, ViewPropTypes } from 'react-native';
import { Svg, Path, G } from 'react-native-svg';
import { Defs, LinearGradient, Stop } from 'react-native-svg';

export default class CircularProgress extends React.PureComponent {
  polarToCartesian(centerX, centerY, radius, angleInDegrees) {
    var angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  }

  circlePath(x, y, radius, startAngle, endAngle) {
    var start = this.polarToCartesian(x, y, radius, endAngle * 0.9999);
    var end = this.polarToCartesian(x, y, radius, startAngle);
    var largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    var d = ['M', start.x, start.y, 'A', radius, radius, 0, largeArcFlag, 0, end.x, end.y];
    return d.join(' ');
  }

  clampFill = fill => Math.min(100, Math.max(0, fill));

  render() {
    const {
      size,
      width,
      backgroundWidth,
      tintColor,
      tintColorSecondary,
      tintTransparency,
      backgroundColor,
      style,
      rotation,
      lineCap,
      lineJoin,
      arcSweepAngle,
      fill,
      children,
      childrenContainerStyle,
      padding,
      renderCap,
      dashedBackground,
      dashedTint,
      onPress
    } = this.props;

    const maxWidthCircle = backgroundWidth ? Math.max(width, backgroundWidth) : width;
    const sizeWithPadding = size / 2 + padding / 2;
    const radius = size / 2 - maxWidthCircle / 2 - padding / 2;

    const currentFillAngle = (arcSweepAngle * this.clampFill(fill)) / 100;
    const backgroundPath = this.circlePath(
      sizeWithPadding,
      sizeWithPadding,
      radius,
      tintTransparency ? 0 : currentFillAngle,
      arcSweepAngle
    );
    const circlePath = this.circlePath(
      sizeWithPadding,
      sizeWithPadding,
      radius,
      0,
      currentFillAngle
    );
    const coordinate = this.polarToCartesian(
      sizeWithPadding,
      sizeWithPadding,
      radius,
      currentFillAngle
    );
    const cap = this.props.renderCap ? this.props.renderCap({ center: coordinate }) : null;

    const offset = size - maxWidthCircle * 2;

    const localChildrenContainerStyle = {
      ...{
        position: 'absolute',
        left: maxWidthCircle + padding / 2,
        top: maxWidthCircle + padding / 2,
        width: offset,
        height: offset,
        borderRadius: offset / 2,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      },
      ...childrenContainerStyle,
    }

    const strokeDasharrayTint = dashedTint.gap > 0 ?
      Object.values(dashedTint)
      .map(value => parseInt(value))
      : null;

    const strokeDasharrayBackground = dashedBackground.gap > 0 ?
      Object.values(dashedBackground)
      .map(value => parseInt(value))
      : null;

    const disabled = !onPress ? true : false

    return (
      <View style={style}>
       <TouchableOpacity activeOpacity={disabled ? 1 : 0.7} disabled={disabled} onPress={onPress}>
        <Svg width={size + padding} height={size + padding}>
          {tintColorSecondary && (
            <Defs>
              <LinearGradient id={'gradient'} x1={'0%'} y={'0%'} x2={'0%'} y2={'100%'}>
                <Stop offset={'0%'} stopColor={tintColor} />
                <Stop offset={'100%'} stopColor={tintColorSecondary} />
              </LinearGradient>
            </Defs>
          )}
          <G rotation={rotation} originX={(size + padding) / 2} originY={(size + padding) / 2}>
            {backgroundColor && (
              <Path
                d={backgroundPath}
                stroke={backgroundColor}
                strokeWidth={backgroundWidth || width}
                strokeLinecap={lineCap}
                strokeLinejoin={lineJoin}
                strokeDasharray={strokeDasharrayBackground}
                fill="none"
              />
            )}
            {fill > 0 && (
              <Path
                d={circlePath}
                stroke={tintColorSecondary ? 'url(#gradient)' : tintColor}
                strokeWidth={width}
                strokeLinecap={lineCap}
                strokeLinejoin={lineJoin}
                strokeDasharray={strokeDasharrayTint}
                fill="none"
              />
            )}
            {cap}
          </G>
        </Svg>
        {children && <View style={localChildrenContainerStyle}>{children(fill)}</View>}
       </TouchableOpacity>
      </View>
    );
  }
}

CircularProgress.propTypes = {
  style: ViewPropTypes.style,
  size: PropTypes.number.isRequired,
  fill: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  backgroundWidth: PropTypes.number,
  tintColor: PropTypes.string,
  tintColorSecondary: PropTypes.string,
  tintTransparency: PropTypes.bool,
  backgroundColor: PropTypes.string,
  rotation: PropTypes.number,
  lineCap: PropTypes.string,
  lineJoin: PropTypes.string,
  arcSweepAngle: PropTypes.number,
  children: PropTypes.func,
  childrenContainerStyle: ViewPropTypes.style,
  padding: PropTypes.number,
  renderCap: PropTypes.func,
  dashedBackground: PropTypes.object,
  dashedTint: PropTypes.object
};

CircularProgress.defaultProps = {
  tintColor: 'black',
  tintTransparency: true,
  rotation: 90,
  lineCap: 'round',
  lineJoin: 'round',
  arcSweepAngle: 360,
  padding: 0,
  dashedBackground: { width: 0, gap: 0 },
  dashedTint: { width: 0, gap: 0 },
};
