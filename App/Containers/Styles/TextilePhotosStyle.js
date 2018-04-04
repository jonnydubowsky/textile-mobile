import { StyleSheet } from 'react-native'
import { ApplicationStyles, Metrics, Colors } from '../../Themes'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  row: {
    flex: 1,
    backgroundColor: Colors.snow,
    // marginVertical: Metrics.smallMargin,
    justifyContent: 'center',
    alignItems: 'center',
    // margin: 2,
    padding: 1,
    // paddingVertical: 10,
    // borderRadius: Metrics.smallMargin
  },
  boldLabel: {
    fontWeight: 'bold',
    alignSelf: 'center',
    color: Colors.snow,
    textAlign: 'center',
    marginBottom: Metrics.smallMargin
  },
  label: {
    textAlign: 'center',
    color: Colors.snow
  },
  listContent: {
    marginTop: Metrics.baseMargin
  },
  statusLabel: {
    textAlign: 'center',
    backgroundColor: Colors.charcoal,
    color: Colors.snow
  }
})
