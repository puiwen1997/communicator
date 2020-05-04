import React from 'react';
import { withNavigation } from 'react-navigation';
import { Platform, TouchableOpacity } from 'react-native';

import { NavBar, Icon } from 'galio-framework';
import theme from '../theme';

class Header extends React.Component {
    render() {
        const { title, navigation } = this.props;
        return (
            <NavBar
                title={title}
                left={(
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Icon 
                    name="menu"
                    family="feather"
                    size={theme.SIZES.BASE}
                    color={theme.COLORS.ICON}
                    />
                </TouchableOpacity>
                )}
                // style={Platform.OS === 'android' ? { marginTop: theme.SIZES.BASE } : null}
            />
        )
    }
}

export default withNavigation(Header);