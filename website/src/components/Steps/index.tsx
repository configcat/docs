import clsx from 'clsx';
import React, { ReactNode } from 'react';
import styles from './styles.module.css';

interface ChildrenProps {
    children: ReactNode;
}

export const Steps: React.FC<ChildrenProps> = ({
    children
}) => {
    return (
        <div className={clsx(styles.steps)}>
            {(React.Children.toArray(children)
                .filter(child => child.type === Step)
                .map((child, index) => {
                    const childNodes = React.Children.toArray(child.props.children);
                    const titleNode = childNodes.find(c => c.type === Title);
                    const content = childNodes.filter(c => c.type !== Title);
                    return titleNode ? (
                        <div key={index} className={clsx(styles.step, styles.withtitle)}>
                            <div className={clsx(styles.titlerow)}>
                                <div className={clsx(styles.stepnumcont)}>
                                    <div className={clsx(styles.stepnum)}>{index + 1}</div>
                                    <div className={clsx(styles.linecont)}>
                                        <div className={clsx(styles.line)}></div>
                                    </div>
                                </div>
                                <div>{titleNode}</div>
                            </div>
                            <div className={clsx(styles.contentrow)}>
                                <div className={clsx(styles.linecont)}>
                                    <div className={clsx(styles.line)}></div>
                                </div>
                                {React.cloneElement(child, { children: content })}
                            </div>
                            <div className={clsx(styles.padder)}>
                                <div className={clsx(styles.linecont)}>
                                    <div className={clsx(styles.line)}></div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div key={index} className={clsx(styles.step, styles.withouttitle)}>
                            <div className={clsx(styles.stepnumcol)}>
                                <div className={clsx(styles.stepnum)}>{index + 1}</div>
                                <div className={clsx(styles.linecont)}>
                                    <div className={clsx(styles.line)}></div>
                                </div>
                            </div>
                            {child}
                        </div>
                    );
                })
            )}
        </div>
    )
};

export const Step: React.FC<ChildrenProps> = ({
    children
}) => {
    return (
        <div className={clsx(styles.content)}>
            {children}
        </div>
    )
};

export const Title: React.FC<ChildrenProps> = ({
    children
}) => {
    return (
        <div className={clsx(styles.title)}>
            {children}
        </div>
    )
};