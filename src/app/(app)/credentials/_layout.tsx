import Tabs from '../../../components/Tabs';

export default function CredentialsLayout() {
  return (
    <Tabs
      tabs={[
        { name: 'physical', title: 'NFC físicas', icon: 'contactless-payment', route: '/credentials/physical' },
        { name: 'mobile', title: 'NFC móviles', icon: 'nfc-variant', route: '/credentials/mobile' },
        { name: 'qr', title: 'Generar QR', icon: 'qrcode', route: '/credentials/qr' },
      ]}
    />
  );
}
