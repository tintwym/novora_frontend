import { useCallback, useMemo, useState } from 'react'
import { mockEmployeeProfile } from '../../data/mockEmployeeProfile'
import type {
  CareerRow,
  DocumentRow,
  EducationRow,
  EmployeeProfileDetail,
  FamilyMemberRow,
  PayLineRow,
  ProfilePersonal,
  ProfileSummary,
  ProfileTabId,
} from '../../types/employeeProfile'
import { PROFILE_TABS } from '../../types/employeeProfile'
import { ProfileHeaderCard } from './ProfileHeader'
import { ProfileModals, type ModalType } from './ProfileModals'
import { ProfileTabContent, type ProfileTabActions } from './ProfileTabs'

export function EmployeeProfile({ employeeId: _employeeId }: { employeeId?: string | null }) {
  const [data, setData] = useState<EmployeeProfileDetail>(() => mockEmployeeProfile())
  const [tab, setTab] = useState<ProfileTabId>('summary')
  const [modal, setModal] = useState<ModalType>(null)
  const [editIndex, setEditIndex] = useState<number | null>(null)

  const openModal = useCallback((type: ModalType, index: number | null = null) => {
    setEditIndex(index)
    setModal(type)
  }, [])

  const closeModal = useCallback(() => {
    setModal(null)
    setEditIndex(null)
  }, [])

  const actions: ProfileTabActions = useMemo(
    () => ({
      onDeleteEmployee: () => {},
      onResetPassword: () => {},
      onEditEmployment: () => openModal('employment'),
      onEditHrNotes: () => openModal('hrNotes'),
      onEditPersonal: () => openModal('personal'),
      onEditAddress: () => openModal('address'),
      onAddFamily: () => openModal('family'),
      onAddKin: () => openModal('kin'),
      onAddBiometric: () => openModal('biometric'),
      onEditPayRate: () => {},
      onAddAllowance: () => openModal('allowance'),
      onEditAllowance: (i) => openModal('allowance', i),
      onAddDeduction: () => openModal('deduction'),
      onEditDeduction: (i) => openModal('deduction', i),
      onAddCareer: () => openModal('career'),
      onEditCareer: (i) => openModal('career', i),
      onAddEducation: () => openModal('education'),
      onEditEducation: (i) => openModal('education', i),
      onUploadDocument: () => openModal('upload'),
      onViewDocument: (i) => openModal('viewDoc', i),
      onPassportEnabled: (v) =>
        setData((d) => ({ ...d, personal: { ...d.personal, passportEnabled: v } })),
      onSameAsPermanent: (v) =>
        setData((d) => ({ ...d, personal: { ...d.personal, sameAsPermanent: v } })),
      onBiometricEnabled: (v) =>
        setData((d) => ({ ...d, biometric: { ...d.biometric, enabled: v } })),
      onAutoClock: (v) =>
        setData((d) => ({ ...d, biometric: { ...d.biometric, autoClock: v } })),
      onIgnoreMissingSwipe: (v) =>
        setData((d) => ({ ...d, biometric: { ...d.biometric, ignoreMissingSwipe: v } })),
      onIgnoreRotaDeduction: (v) =>
        setData((d) => ({ ...d, biometric: { ...d.biometric, ignoreRotaDeduction: v } })),
    }),
    [openModal],
  )

  return (
    <div className="emp-profile">
      <ProfileHeaderCard header={data.header} />

      <nav className="emp-profile-tabs" aria-label="Profile sections">
        {PROFILE_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={tab === t.id ? 'active' : ''}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div className="emp-profile-body">
        <ProfileTabContent tab={tab} data={data} actions={actions} />
      </div>

      <ProfileModals
        modal={modal}
        editIndex={editIndex}
        data={data}
        onClose={closeModal}
        onSaveSummary={(summary: ProfileSummary) => setData((d) => ({ ...d, summary }))}
        onSavePersonal={(personal: ProfilePersonal) => setData((d) => ({ ...d, personal }))}
        onSaveAllowance={(row: PayLineRow, index: number | null) =>
          setData((d) => {
            const allowances = [...d.payRate.allowances]
            if (index != null) allowances[index] = row
            else allowances.push(row)
            return { ...d, payRate: { ...d.payRate, allowances } }
          })
        }
        onSaveDeduction={(row: PayLineRow, index: number | null) =>
          setData((d) => {
            const deductions = [...d.payRate.deductions]
            if (index != null) deductions[index] = row
            else deductions.push(row)
            return { ...d, payRate: { ...d.payRate, deductions } }
          })
        }
        onSaveCareer={(row: CareerRow, index: number | null) =>
          setData((d) => {
            const rows = [...d.career.rows]
            if (index != null) rows[index] = row
            else rows.push(row)
            return { ...d, career: { rows } }
          })
        }
        onSaveEducation={(row: EducationRow, index: number | null) =>
          setData((d) => {
            const rows = [...d.education.rows]
            if (index != null) rows[index] = row
            else rows.push(row)
            return { ...d, education: { rows } }
          })
        }
        onSaveDocument={(row: DocumentRow) =>
          setData((d) => ({ ...d, documents: { rows: [...d.documents.rows, row] } }))
        }
        onSaveFamily={(row: FamilyMemberRow) =>
          setData((d) => ({
            ...d,
            family: { ...d.family, members: [...d.family.members, row] },
          }))
        }
      />
    </div>
  )
}
