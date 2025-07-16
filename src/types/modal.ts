export interface ModalProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
  isOpen: boolean;
  headerTitle?: string;
  onClose?: () => void;
}
