import React from 'react';

import { IconButton } from '../IconButton';
import { Modal } from 'components/molecules/Modal';

import { ASSETS } from 'helpers/config';
import { language } from 'helpers/language';

import * as S from './styles';

export default function FAQ() {
    const [open, setOpen] = React.useState<boolean>(false);
    
    return (
        <>
            {open &&
                <Modal header={language.faq.header} handleClose={() => setOpen(false)}>
                    <S.Info>
                        {language.faq.list.map((qA: { q: string, a: string }, index: number) => {
                            return (
                                <S.QA key={index}>
                                    <S.Question>{qA.q}</S.Question>
                                    <S.Answer>{qA.a}</S.Answer>
                                </S.QA>
                            )
                        })}
                    </S.Info>
                </Modal>
            }
            <S.Wrapper>
                <IconButton
                    type={'alt1'}
                    src={ASSETS.info}
                    handlePress={() => setOpen(true)}
                />
            </S.Wrapper>
        </>
    )
}